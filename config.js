var mongoose   = require('mongoose');

if (mongoose.connection.readyState == 0) {
    mongoose.connect('mongodb://akoss:dreher@127.0.0.1:27017/mydb');
}