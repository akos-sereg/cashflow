function ExpenseAggregator(rows) {
    this.rows = rows; // array of cashflow.expense items (from database), plus DAYS_SINCE_EPOCH field
    this.currentAmount = 0;
}

ExpenseAggregator.prototype.Aggregate = function(color, name) {
    var result = [];

    if (this.rows == null || this.rows.length == 0) {
        return result;
    }

    var result = { 'color': color, 'name': name, 'data': [ ] };
    var firstDay = this.rows[0].DAYS_SINCE_EPOCH;
    var lastDay = this.rows[this.rows.length-1].DAYS_SINCE_EPOCH;

    for (var dayFromEpoch = firstDay; dayFromEpoch <= lastDay; dayFromEpoch++) {
        result.data[dayFromEpoch-firstDay] = {
            'x': dayFromEpoch * 60 * 60 * 24,
            'y': this.GetAggregatedAmount(dayFromEpoch),
            title: this.GetAggregatedTitle(dayFromEpoch)
        };
    }

    return result;
}

ExpenseAggregator.prototype.GetAggregatedAmount = function(dayFromEpoch) {

    for (var i=0; i!=this.rows.length; i++) {
        if (this.rows[i].DAYS_SINCE_EPOCH == dayFromEpoch) {
            this.currentAmount += this.rows[i].expense_value;
        }
    }

    return this.currentAmount;
}

ExpenseAggregator.prototype.FormatAmount = function(amount) {
    var x = Math.ceil(amount);
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}

ExpenseAggregator.prototype.GetAggregatedTitle = function(dayFromEpoch) {

    var title = this.FormatAmount(this.currentAmount) + '<br/><br/>';
    var expenseAdded = false;

    for (var i=0; i!=this.rows.length; i++) {
        if (this.rows[i].DAYS_SINCE_EPOCH == dayFromEpoch) {
            expenseAdded = true;
            title += this.rows[i].location + ' ('+this.FormatAmount(this.rows[i].expense_value)+')<br/>';
        }
    }

    return !expenseAdded ? title + 'No expense at current date' : title;
}

module.exports = ExpenseAggregator;