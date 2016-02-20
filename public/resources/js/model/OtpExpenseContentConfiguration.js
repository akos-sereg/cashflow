// OTP Configuration
// -----------------------------------------------

function OtpExpenseContentConfiguration() {
    this.DateIndex     = 4;
    this.TitleIndex    = 12;
    this.AmountIndex   = 2;
    this.LocationIndex = [8, 9];
    this.TransactionIdIndex = [4, 2, 12];

    this.Currency      = 'HUF';
    this.DecimalMark   = /,/g;
    this.ThousandSeparator = /\s/g;
    this.SplitColumnsRegex = null;
    this.SplitColumnsChar = ';';

    this.RecurringTransactionIds = [ 'NAPKÖZBENI ÁTUTALÁS (CSOPORTOS)' ];
}

OtpExpenseContentConfiguration.prototype.GetMaxIndex = function() {
    return 12;
}

OtpExpenseContentConfiguration.prototype.ParseDate = function(dateStr) {
    // Convert '20160101' to '2016-01-01'
    return dateStr.substring(0, 4) + '-' + dateStr.substring(4, 6) + '-' + dateStr.substring(6, 8);
}