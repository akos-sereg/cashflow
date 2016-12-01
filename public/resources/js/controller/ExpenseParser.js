function ExpenseParser() {

}

// Takes CSV content, produces an array of expense items where each item looks like
// this: { Date { Value, Display }, Title, Amount { Display, Value }, Location, TransactionId }
ExpenseParser.prototype.Parse = function(content, logConfiguration) {

    var data = [];

    // Default is OTP CSV Configuration
    if (!logConfiguration) {
       logConfiguration = new OtpExpenseContentConfiguration();   
    }

    // Go through Content
    var contentLines = content.match(/[^\r\n]+/g);

    for (var lineNumber = 0; lineNumber!=contentLines.length; lineNumber++) {
        var columns = [];
        if (logConfiguration.SplitColumnsChar) {
            columns = contentLines[lineNumber].split(logConfiguration.SplitColumnsChar);
        } else {
            columns = contentLines[lineNumber].match(logConfiguration.SplitColumnsRegex);
        }

        if (columns != null && columns.length > logConfiguration.GetMaxIndex()) {

            var dataItem = new ExpenseItem();
            dataItem.Date = { };

            try {
                dataItem.Date.Value = new Date(logConfiguration.ParseDate(columns[logConfiguration.DateIndex]));
                dataItem.Date.Display = dataItem.Date.Value.toLocaleDateString().replace(/\. /g, '-').replace(/\./, '');

                if (dataItem.Date.Value == 'Invalid Date') {
                    throw new Error('Could not parse Date');
                }
            }
            catch (error) {
                dataItem.Date.Display = columns[logConfiguration.DateIndex];
                dataItem.Date.Value = null;
            }

            dataItem.Title = columns[logConfiguration.TitleIndex];

            if (Array.isArray(logConfiguration.TransactionIdIndex)) {
                var transactionId = '';
                for (var i=0; i!=logConfiguration.TransactionIdIndex.length; i++) {
                    transactionId += columns[logConfiguration.TransactionIdIndex[i]];
                }

                dataItem.TransactionId = transactionId;
            }
            else {
                dataItem.TransactionId = columns[logConfiguration.TransactionIdIndex];
            }

            dataItem.Amount = { };
            dataItem.Amount.Value = this.GetClearedAmount(columns[logConfiguration.AmountIndex], logConfiguration, '');
            dataItem.Amount.Display = this.GetClearedAmount(columns[logConfiguration.AmountIndex], logConfiguration, ' ');

            dataItem.GetHash = ExpenseItem.prototype.GetHash;
            dataItem.LogConfiguration = logConfiguration;

            if (Array.isArray(logConfiguration.LocationIndex)) {
                var location = '';
                for (var i=0; i!=logConfiguration.LocationIndex.length; i++) {
                    location += columns[logConfiguration.LocationIndex[i]] + ' ';
                }
                dataItem.Location = location;
            }
            else {
                dataItem.Location = columns[logConfiguration.LocationIndex];
            }
            
            dataItem.Valid = this.IsValidRow(dataItem);

            data.push(dataItem);
        }
    }

    return data;
}

// Checks if row has valid Amount
ExpenseParser.prototype.IsValidRow = function(row) {
    return !isNaN(row.Amount.Value);
}

ExpenseParser.prototype.GetClearedAmount = function(rawAmount, logConfiguration, newThousandSeparator) {
    var amount = rawAmount
        .replace(' ', '')
        .replace(logConfiguration.Currency, '')
        .replace(logConfiguration.ThousandSeparator, newThousandSeparator)
        .replace(logConfiguration.DecimalMark, '.');

    return amount;
}
