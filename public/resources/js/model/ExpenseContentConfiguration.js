// Raiffeisen Configuration
// -----------------------------------------------

function ExpenseContentConfiguration() {
    this.DateIndex     = 1;
    this.TitleIndex    = 0;
    this.AmountIndex   = 4;
    this.LocationIndex = 6;
    this.Separator     = ';';
}

ExpenseContentConfiguration.prototype.GetMaxIndex = function() {
    return 6;
}