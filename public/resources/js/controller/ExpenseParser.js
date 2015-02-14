function ExpenseParser() {

}

// Takes CSV content, produces an array of expense items where each item looks like
// this: { Date, Title, Amount { Display, Value }, Location }
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
            var dataItem = {};

            dataItem.date = columns[logConfiguration.DateIndex];
            dataItem.Title = columns[logConfiguration.TitleIndex];
            dataItem.Amount = { };
            dataItem.Amount.Value = this.GetClearedAmount(columns[logConfiguration.AmountIndex], logConfiguration, '');
            dataItem.Amount.Display = this.GetClearedAmount(columns[logConfiguration.AmountIndex], logConfiguration, ' ');

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