var express     = require('express');
var path        = require('path');
var app         = express();
var bodyParser  = require('body-parser');
var mysql       = require('mysql');
var async       = require('async');

// MySQL Connection
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'lofasz'
});

connection.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

var port = process.env.PORT || 3005;

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
router.route('/getExpenses')

    .get(function(req, res) {
        var results = [];
        results[0] = { type: 'asd', expense_date: '2015-03-01', transactionId: 'asd', expense_value: 22.0, location: 'Budapest', comment: 'ss', expense_currency: 'HUF', user_comment: 'asd', account_id: 1 };
        results[1] = { type: 'asd', expense_date: '2015-03-05', transactionId: 'asd', expense_value: 19.0, location: 'Budapest', comment: 'ss', expense_currency: 'HUF', user_comment: 'asd', account_id: 1 };
        results[2] = { type: 'asd', expense_date: '2015-03-12', transactionId: 'asd', expense_value: 21.0, location: 'Budapest', comment: 'ss', expense_currency: 'HUF', user_comment: 'asd', account_id: 1 };
        results[3] = { type: 'asd', expense_date: '2015-03-14', transactionId: 'asd', expense_value: 5.0, location: 'Budapest', comment: 'ss', expense_currency: 'HUF', user_comment: 'asd', account_id: 1 };
        results[4] = { type: 'asd', expense_date: '2015-03-18', transactionId: 'asd', expense_value: 45.0, location: 'Budapest', comment: 'ss', expense_currency: 'HUF', user_comment: 'asd', account_id: 1 };
        results[5] = { type: 'asd', expense_date: '2015-03-27', transactionId: 'asd', expense_value: 12.0, location: 'Budapest', comment: 'ss', expense_currency: 'HUF', user_comment: 'asd', account_id: 1 };

        var result = [
            {
                "color": "#c05020",
                "name": "Expenses",
                "data": [ ]
            }
        ];

        for (var i=0; i!=results.length; i++) {
            result[0].data[i] = { 'x': i, 'y': results[i].expense_value, object: results[i] };
        }

        res.send(result);
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
                    msg = 'Ignoring [' + expenseItem.Date.Display + '] ' + expenseItem.Amount.Display + ' @ ' + expenseItem.Location;
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