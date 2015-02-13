var express     = require('express');
var path        = require('path');
var app         = express();
var bodyParser  = require('body-parser');

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

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Cashflow server listening on port ' + port);