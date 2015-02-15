function ExpenseParser() {

}

// Takes CSV content, produces an array of expense items where each item looks like
// this: { Date { Value, Display }, Title, Amount { Display, Value }, Location, TransactionId }
ExpenseParser.prototype.Parse = function(content) {

    var data = [];

    // Raiffeisen CSV Configuration
    var logConfiguration = new ExpenseContentConfiguration();

    // Go through Content
    var contentLines = content.match(/[^\r\n]+/g);
    var splitColumnsRegex = new RegExp('[^' + logConfiguration.Separator + ']+', 'g');

    for (var lineNumber = 0; lineNumber!=contentLines.length; lineNumber++) {
        var columns = contentLines[lineNumber].match(splitColumnsRegex);

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
            dataItem.TransactionId = columns[logConfiguration.TransactionIdIndex];

            dataItem.Amount = { };
            dataItem.Amount.Value = this.GetClearedAmount(columns[logConfiguration.AmountIndex], logConfiguration, '');
            dataItem.Amount.Display = this.GetClearedAmount(columns[logConfiguration.AmountIndex], logConfiguration, ' ');

            dataItem.GetHash = ExpenseItem.prototype.GetHash;
            dataItem.LogConfiguration = logConfiguration;

            dataItem.Location = columns[logConfiguration.LocationIndex];

            if (this.IsValidRow(dataItem)) {
                data.push(dataItem);
            }
        }
    }

    return data;
}

// Checks if row has valid Amount
ExpenseParser.prototype.IsValidRow = function(row) {
    return true;
    //return !isNaN(row.Value);
}

ExpenseParser.prototype.GetClearedAmount = function(rawAmount, logConfiguration, newThousandSeparator) {
    var amount = rawAmount
        .replace(' ', '')
        .replace(logConfiguration.Currency, '')
        .replace(logConfiguration.ThousandSeparator, newThousandSeparator)
        .replace(logConfiguration.DecimalMark, '.');

    return amount;
}
