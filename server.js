var express     = require('express');
var path        = require('path');
var app         = express();
var bodyParser  = require('body-parser');
var mysql       = require('mysql');
var async       = require('async');
var chalk       = require('chalk');
var untrustedFilter = require('express-defend');
var blacklist   = require('express-blacklist');
var ip          = require('ip');
var ipFilter    = require('express-ip-filter')

var aggregator  = require('./controller/ExpenseAggregator');
var config      = require('./config');
var sqlTemplate = require('./controller/SqlTemplate.js');
var sqlTemplateList = require('./sql-template-list.js');

// Below constants are common in mysql and sqlite databases
var ACCOUNT_ID_FOR_EXPENSES = 1;
var ACCOUNT_ID_FOR_SAVINGS = 3;

sqlTemplate.use(config);
sqlTemplateList.load(sqlTemplate);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(blacklist.blockRequests('blacklist.txt'));
app.use(untrustedFilter.protect({ 
    maxAttempts: 5, 
    dropSuspiciousRequest: true, 
    consoleLogging: true,
    logFile: 'suspicious.log', 
    onMaxAttemptsReached: function(ipAddress, url){
        blacklist.addAddress(ipAddress);
    } 
}));

app.use(function(request, response, next) {
    console.log(chalk.green('Request') + ' from ' + request.connection.remoteAddress + ' for ' + request.method + ' ' + request.originalUrl);
    next();
});

if (config.allowedIpRange != null) {
    app.use(ipFilter({
      forbidden: '403: Forbidden',
      filter: [ config.allowedIpRange ]
    }));
}

app.use(express.static(path.join(__dirname, 'public')));

var port = process.env.PORT || 3009;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

router.use(function(req, res, next) {
    console.log(req.headers);
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'You can find the API at /api' });
});

// Store expenses (Input tab)
router.route('/storeExpenses')

    .post(function(req, res) {

        var calls = [];
        for (var i=0; i!=req.body.length; i++) {
            // Pushing individual expense item processors into calls array
            calls.push(createTask(req.body[i]));
        }

        // Synchronizing calls
        async.parallel(calls, function(err, results) {
            res.send(results);
        });
    });

// Graph source
router.route('/getAggregatedExpenses')

    .get(function(req, res) {

        var calls = [];
        var expenseResults = null;
        var savingsResults = null;

        // Declare function for Expense fetching
        var fetchExpenses = function(callback) {

            sqlTemplate
                .getTemplate('FetchExpenses')
                .fill([req.param('startDate'), req.param('endDate'), ACCOUNT_ID_FOR_EXPENSES])
                .execute(function(err, rows, fields) {

                    if (err) {
                        console.log(err);
                        return;
                    }

                    var expenseAggregator = new aggregator(rows);
                    var result = expenseAggregator.Aggregate('#c05020', 'Expenses');

                    expenseResults = result;
                    callback();
                });
        }

        // Declare function for Savings fetching
        var fetchSavings = function(callback) {

            sqlTemplate
                .getTemplate('FetchSavings')
                .fill([req.param('startDate'), req.param('endDate'), ACCOUNT_ID_FOR_SAVINGS])
                .execute(function(err, rows, fields) {

                    if (err) {
                        console.log(err);
                        return;
                    }

                    var savingsColor = '#54A6FE';
                    var savingsAggregator = new aggregator(rows);
                    var result = savingsAggregator.Aggregate(savingsColor, 'Savings');

                    if (rows.length == 0) {
                        result = { color: savingsColor, data: [], name: 'Savings' };
                    }

                    savingsResults = result;
                    callback();
                });
        }

        calls.push(fetchExpenses);
        calls.push(fetchSavings);

        async.parallel(calls, function(){
            res.send([expenseResults, savingsResults]);
        });

     });

// Expense Data
router.route('/recordSavings')

    .post(function(req, res) {

        sqlTemplate
            .getTemplate('RecordSavings')
            .fill([
                 req.body['savingsDate'],
                 req.body['savingsAmount'],
                 req.body['savingsComment'],
                 ACCOUNT_ID_FOR_SAVINGS
            ])
            .execute(function(err, rows, fields) {

                if (err) {
                    console.log(err);
                    return;
                }

                res.send([err, rows, fields]);
            });
     });

router.route('/getExpenses')

    .get(function(req, res) {

        sqlTemplate
            .getTemplate('GetExpenses')
            .fill([req.param('startDate'), req.param('endDate'), ACCOUNT_ID_FOR_EXPENSES])
            .execute(function(err, rows, fields) {

                if (err) {
                    console.log(err);
                    return;
                }

                res.set({ 'content-type': 'application/json; charset=utf-8' });
                res.send(rows);
            });
     });

router.route('/removeTransaction')

     .post(function(req, res) {

        sqlTemplate
            .getTemplate('RemoveTransactionTags')
            .fill([req.body['transactionId']])
            .execute(function(err, rows, fields) {

                if (err) {
                     console.log(err);
                     return;
                }

                // Delete expense record as well
                sqlTemplate
                    .getTemplate('RemoveTransaction')
                    .fill([req.body['transactionId']])
                    .execute(function(err, rows, fields) {

                        if (err) {
                            console.log(err);
                            return;
                        }

                        res.send(rows);
                    });
            });
      });

// Tags
router.route('/getTags')

    .get(function(req, res) {

        var template = sqlTemplate.getTemplate('GetTags');

        template.execute(function(err, rows, fields) {

                if (err) {
                    console.log(err);
                    return;
                }

                res.send(rows);
            });
     });

router.route('/getExpectedExpenseTypes')

    .get(function(req, res) {

        sqlTemplate
            .getTemplate('GetExpectedExpenseTypes')
            .execute(function(err, rows, fields) {

                if (err) {
                    console.log(err);
                    return;
                }

                res.send(rows);
            });
     });

router.route('/getExpectedExpenses')

    .get(function(req, res) {

        sqlTemplate
            .getTemplate('GetExpectedExpenses')
            .fill([req.param('date'), req.param('date')])
            .execute(function(err, rows, fields) {

                if (err) {
                    console.log(err);
                    return;
                }

                var data = [];
                for (var i=0; i<rows.length; i++) {
                    var row = {};
                    row['effective_date'] = rows[i].effective_date;
                    row['expected_id_' + rows[i].type_id] = rows[i].name;
                    row['column_id'] = 'expected_id_' + rows[i].type_id;
                    row['name'] = rows[i].name;
                    row['amount'] = rows[i].amount;
                    row['paid'] = rows[i].paid;
                    row['id'] = rows[i].id;
                    data.push(row);
                }

                res.send(data);
            });
     });

router.route('/createExpectedExpense')

     .post(function(req, res) {

        sqlTemplate
            .getTemplate('CreateExpectedExpense')
            .fill([
                 req.body['typeId'],
                 req.body['name'],
                 req.body['amount'],
                 req.body['effectiveDate']
            ])
            .execute(function(err, rows, fields) {

                res.send([err, rows, fields]);
            });
      });

router.route('/deleteExpectedExpense')

     .post(function(req, res) {

        sqlTemplate
            .getTemplate('DeleteExpectedExpense')
            .fill([req.body['id']])
            .execute(function(err, rows, fields) {

                res.send([err, rows, fields]);
            });
      });

router.route('/setExpectedExpenseStatus')

    .post(function(req, res) {

        sqlTemplate
            .getTemplate('SetExpectedExpenseStatus')
            .fill([ req.body['status'], req.body['itemId'] ])
            .execute(function(err, rows, fields) {

                res.send([err, rows, fields]);
            });
    });


router.route('/setTag')

    .post(function(req, res) {

        sqlTemplate
            .getTemplate('DeleteTransactionTag')
            .fill([ req.body['transactionId'] ])
            .execute(function(err, rows, fields) {

                if (err) {
                    console.log(err);
                    return;
                }

                sqlTemplate
                    .getTemplate('CreateTransactionTag')
                    .fill([
                        req.body['transactionId'],
                        req.body['tagLabel']
                    ])
                    .execute(function(err, rows, fields) {

                        if (err) {
                            console.log(err);
                            return;
                        }

                        res.send(rows);
                    });


            });
     });

// Rules (tag associations)
router.route('/getTagAssociations')

     .get(function(req, res) {

        sqlTemplate
            .getTemplate('GetTagAssociations')
            .execute(function(err, rows, fields) {

                 if (err) {
                     console.log(err);
                     return;
                 }

                 res.send(rows);
             });
  });

router.route('/addTagAssociation')

     .post(function(req, res) {

         if (req.body['ruleName'].length == 0 || req.body['pattern'].length == 0 || req.body['tagLabel'].length == 0) {
            res.send({isSuccess: false, errorMessage: 'Request validation failed'});
            return;
         }

         sqlTemplate
            .getTemplate('CreateTagRule')
            .fill([ req.body['ruleName'], req.body['pattern'], req.body['tagLabel'] ])
            .execute(function(err, rows, fields) {

                 if (err) {
                     console.log(err);
                     res.send({isSuccess: false, errorMessage: err});
                     return;
                 }

                 res.send({isSuccess: true, errorMessage: null});
             });

      });

router.route('/removeTagAssociation')

     .post(function(req, res) {

         if (req.body['ruleId'].length == 0) {
            res.send({isSuccess: false, errorMessage: 'Request validation failed'});
            return;
         }

         sqlTemplate
            .getTemplate('RemoveTagRule')
            .fill([ req.body['ruleId'] ])
            .execute(function(err, rows, fields) {

                 if (err) {
                     console.log(err);
                     res.send({isSuccess: false, errorMessage: err});
                     return;
                 }

                 res.send({isSuccess: true, errorMessage: null});
             });

      });

// Get aggregated expenses by tag (for Bar Chart)
router.route('/getAggregatedExpensesByTags')

    .get(function(req, res) {

        sqlTemplate
            .getTemplate('GetAggregatedExpensesByTags')
            .fill([req.param('startDate'), req.param('endDate'), ACCOUNT_ID_FOR_EXPENSES])
            .execute(function(err, rows, fields) {

                if (err) {
                    console.log(err);
                    return;
                }

                res.send(rows);
            });
     });

app.use('/api', router);


function createTask(expenseItem) {
    return function(callback) {
        processExpenseItem(expenseItem, callback);
    }
}

function processExpenseItem(expenseItem, callback) {

    console.log('Executing... ' + expenseItem.Location);

    // Process one expense record item
    sqlTemplate
        .getTemplate('GetTransaction')
        .fill([expenseItem.Hash])
        .execute((function(expenseItem){
            return function(err, rows, fields) {

                if (err) {
                    console.log(err);
                    return;
                }

                var msg = '';
                if (rows != null && rows.length == 0) {
                    msg = 'Inserting Record [' + expenseItem.Date.Display + '] ' + expenseItem.Amount.Display + ' @ ' + expenseItem.Location;

                    var post  = {
                        type: expenseItem.Title,
                        expense_date: expenseItem.Date.Display,
                        transactionId: expenseItem.Hash,
                        expense_value: expenseItem.Amount.Value,
                        location: expenseItem.Location,
                        comment: '',
                        expense_currency: 'HUF',
                        user_comment: '',
                        account_id: ACCOUNT_ID_FOR_EXPENSES
                    };

                    sqlTemplate
                        .getTemplate('CreateTransaction')
                        .fill(post)
                        .execute(function(err, rows, fields) {

                            if(err) {
                                console.log(err);
                            }
                            else {
                                console.log('Inserted.');
                            }
                        });

                }
                else {

                    sqlTemplate
                        .getTemplate('UpdateTransaction')
                        .fill([ expenseItem.Location, expenseItem.Hash ])
                        .execute(function(err, rows, fields) {

                            if(err) {
                                console.log(err);
                            }
                            else {
                                console.log('Row updated: TransactionID = ' + expenseItem.Hash);
                            }
                        });

                    msg = 'Updating [' + expenseItem.Date.Display + '] ' + expenseItem.Amount.Display + ' @ ' + expenseItem.Location;
                }

                console.log(msg);
                callback(null, msg);
            };
        })(expenseItem));
}

// ON TERMINATION
// =============================================================================
process.on('SIGINT', function() {
    sqlTemplate.dispose();
    process.exit();
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Cashflow server listening on port ' + port + ' using ' + chalk.green(config.databaseEngine) + ' database');
console.log('Started at ' + ip.address());
if (config.allowedIpRange != null) {
    console.log('Allowed IP Range: ' + config.allowedIpRange);
}
else {
    console.log('IP filtering is switched OFF!');
}
