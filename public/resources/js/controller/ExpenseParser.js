function ExpenseParser() {

}

// Takes CSV content, produces an array of expense items where each item looks like
// this: { Date, Title, Amount, Location }
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
            dataItem.Amount = columns[logConfiguration.AmountIndex];
            dataItem.Location = columns[logConfiguration.LocationIndex];

            data.push(dataItem);
        }
    }

    return data;
}