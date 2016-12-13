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
//var expenseDao = require('./dao/ExpenseDao.js');

var ACCOUNT_ID_FOR_EXPENSES = 1;
var ACCOUNT_ID_FOR_SAVINGS = 3;

var connection = mysql.createConnection(config.mysql);
connection.connect();
sqlTemplate.use(connection);
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

        connection.query('INSERT INTO cashflow.expense (type, expense_date, transactionId, expense_value, location, comment, '
               + 'expense_currency, insert_date, user_comment, account_id, modified_date) '
               + 'VALUES ("Atutalas", ?, CONCAT("manual", NOW()), ?, ?, null, "HUF", NOW(), null, ?, null) ',
             [
                 req.body['savingsDate'],
                 req.body['savingsComment'],
                 req.body['savingsAmount'],
                 ACCOUNT_ID_FOR_SAVINGS
             ],
             function(err, result, fields) {

                 res.send([err, result, fields]);
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

                res.send(rows);
            });
     });

router.route('/removeTransaction')

     .post(function(req, res) {

         // Delete expense tag for record (if any)
         connection.query('DELETE FROM cashflow.expense_tag WHERE transactionId = ?',
             [
                 req.body['transactionId'],
             ],
             function(err, rows, fields) {

                 if (err) {
                     console.log(err);
                     return;
                 }

                 // Delete expense record as well
                 connection.query('DELETE FROM cashflow.expense WHERE transactionId = ?',
                 [
                    req.body['transactionId'],
                 ],
                 function(err, rows, fields) {

                    if (err) {
                        console.log(err);
                        return;
                    }

                    res.send(rows);
                 });

                 res.send(rows);
             });
      });

// Tags
router.route('/getTags')

    .get(function(req, res) {

        connection.query('SELECT tag.id, tag.label FROM cashflow.tag ORDER BY label ASC', [ ],
            function(err, rows, fields) {

                if (err) {
                    console.log(err);
                    return;
                }

                res.send(rows);
            });
     });

router.route('/getExpectedExpenseTypes')

    .get(function(req, res) {

        connection.query('SELECT expected_expense_type.id, expected_expense_type.name FROM cashflow.expected_expense_type ORDER BY name ASC', [ ],
            function(err, rows, fields) {

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

         connection.query('INSERT INTO cashflow.expected_expense (id, expected_expense_type_id, name, amount, effective_date, paid) VALUES (default, ?, ?, ?, ?, 0) ',
             [
                 req.body['typeId'],
                 req.body['name'],
                 req.body['amount'],
                 req.body['effectiveDate']
             ],
             function(err, result, fields) {

                 res.send([err, result, fields]);
             });
      });

router.route('/deleteExpectedExpense')

     .post(function(req, res) {

         connection.query('DELETE FROM cashflow.expected_expense WHERE id = ?',
             [ req.body['id'] ],
             function(err, result, fields) {
                 res.send([err, result, fields]);
             });
      });

router.route('/setExpectedExpenseStatus')

    .post(function(req, res) {

        connection.query('UPDATE cashflow.expected_expense SET paid = ? WHERE id = ?', [ req.body['status'], req.body['itemId'] ],
            function(err, rows, fields) {
                res.send([ err, rows, fields ]);
            }
        );
    });


router.route('/setTag')

    .post(function(req, res) {

        connection.query('DELETE FROM cashflow.expense_tag WHERE transactionId = ?', [ req.body['transactionId'] ],
            function(err, rows, fields) {

                if (err) {
                    console.log(err);
                    return;
                }

                connection.query('INSERT INTO cashflow.expense_tag (transactionId, tag_id) VALUES(?, (SELECT id FROM cashflow.tag WHERE label = ?))',
                [
                    req.body['transactionId'],
                    req.body['tagLabel']
                ],
                    function(err, result, fields) {

                        if (err) {
                            console.log(err);
                            return;
                        }

                        res.send(result);
                    });
            });
     });

// Rules (tag associations)
router.route('/getTagAssociations')

     .get(function(req, res) {

        sqlTemplate
            .getTemplate('GetTagAssociations').fill([])
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

         connection.query('INSERT INTO cashflow.tag_rule (rule_id, name, pattern, tag_id) VALUES (DEFAULT, ?, ?, (SELECT id FROM cashflow.tag WHERE label = ?))',
             [ req.body['ruleName'], req.body['pattern'], req.body['tagLabel'] ],
             function(err, rows, fields) {

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

         connection.query('DELETE FROM cashflow.tag_rule WHERE rule_id = ?',
             [ req.body['ruleId'] ],
             function(err, rows, fields) {

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
    connection.query('SELECT transactionId FROM cashflow.expense WHERE transactionId = ?', [ expenseItem.Hash ],
        (function(expenseItem){
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
                        account_id: 1
                    };

                    connection.query('INSERT INTO cashflow.expense SET insert_date = NOW(), modified_date = NOW(), ?', post, function(err, result) {
                        if(err) {
                            console.log(err);
                        }
                        else {
                            console.log('Inserted.');
                        }
                    });
                }
                else {
                    connection.query('UPDATE cashflow.expense SET modified_date = NOW(), location = ? WHERE transactionId = ?', [ expenseItem.Location, expenseItem.Hash ], function(err, result) {
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
    console.log('About to exit, closing MySQL Connection');
    connection.end();
    console.log('MySQL Connection closed.');

    process.exit();
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Cashflow server listening on port ' + port);
console.log('Started at ' + ip.address());
if (config.allowedIpRange != null) {
    console.log('Allowed IP Range: ' + config.allowedIpRange);
}
else {
    console.log('IP filtering is switched OFF!');
}
