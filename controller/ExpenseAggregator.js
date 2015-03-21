function ExpenseAggregator(rows) {
    this.rows = rows; // array of cashflow.expense items (from database), plus DAYS_SINCE_EPOCH field
    this.currentAmount = 0;
}

ExpenseAggregator.prototype.Aggregate = function() {
    var result = [];

    if (this.rows == null || this.rows.length == 0) {
        return result;
    }

    var result = [ { 'color': '#c05020', 'name': 'Expenses', 'data': [ ] }];
    var firstDay = this.rows[0].DAYS_SINCE_EPOCH;
    var lastDay = this.rows[this.rows.length-1].DAYS_SINCE_EPOCH;

    for (var dayFromEpoch = firstDay; dayFromEpoch != lastDay; dayFromEpoch++) {
        result[0].data[dayFromEpoch-firstDay] = {
            'x': dayFromEpoch-firstDay,
            'y': this.GetAggregatedAmount(dayFromEpoch)
        };
    }

    return result;
}

ExpenseAggregator.prototype.GetAggregatedAmount = function(dayFromEpoch) {

    var itemsAtCurrentDate = [ ];

    for (var i=0; i!=this.rows.length; i++) {
        if (this.rows[i].DAYS_SINCE_EPOCH == dayFromEpoch) {
            this.currentAmount += this.rows[i].expense_value;
        }
    }

    return this.currentAmount;
}

module.exports = ExpenseAggregator;