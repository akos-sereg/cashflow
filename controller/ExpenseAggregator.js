var moment      = require('moment');
var chartDataProvider = require('chart-data-provider');

function ExpenseAggregator(rows) {
    this.rows = rows; // array of cashflow.expense items (from database), plus DAYS_SINCE_EPOCH field
    this.currentAmount = 0;
}

ExpenseAggregator.prototype.Aggregate = function(color, name) {
    
    var result = { 'color': color, 'name': name, 'data': [ ] };

    if (this.rows == null || this.rows.length == 0) {
        return result;
    }

    var self = this;

    var data = chartDataProvider
        .range(this.rows[0].expense_date, moment(this.rows[this.rows.length-1].expense_date).format('YYYY-MM-DD'))
        .axis({ 
            x: { 
                input: { fieldName: 'expense_date' },
                output: { 
                    fieldName: 'x',        // Name of output property
                    type: 'EPOCH',         // EPOCH|EPOCH_IN_MS|YYYY-MM-DD
                    index: true            // Whether or not we want to have an index property (named 'index')
                }
            }, 
            y: { 
                input: { fieldName: 'expense_value' },
                output: { 
                    fieldName: 'y',
                    calculation: chartDataProvider.SUM_UP_TO_CURRENT_DATE
                }
            } 
        })
        .data(this.rows, { 
            itemRenderer: function(recordsOnDate, chartItem) {
                var title = self.FormatAmount(chartItem.y) + ' Ft<br/>';
                recordsOnDate.forEach(function(x) {
                    title += x.location + ' ('+self.FormatAmount(x.expense_value)+')<br/>';
                });

                chartItem.title = title;
            }
        });

    result.data = data;
    
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