// Raiffeisen Configuration
// -----------------------------------------------

function RaiffeisenExpenseContentConfiguration() {
    this.DateIndex     = 1;
    this.TitleIndex    = 0;
    this.AmountIndex   = 4;
    this.LocationIndex = 6;
    this.TransactionIdIndex = 3;

    this.Currency      = 'HUF';
    this.DecimalMark   = /,/g;
    this.ThousandSeparator = /\s/g;
    this.SplitColumnsRegex = new RegExp('[^;]+', 'g');
    this.SplitColumnsChar = null;

    this.RecurringTransactionIds = [ 'CSOPORTOS BESZED' ];
}

RaiffeisenExpenseContentConfiguration.prototype.GetMaxIndex = function() {
    return 6;
}

RaiffeisenExpenseContentConfiguration.prototype.ParseDate = function(dateStr) {
    return dateStr.substring(0, 10);
}