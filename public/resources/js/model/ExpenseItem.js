function ExpenseItem() {
    this.AccountId = 1; // Default
}

// Get hash of expense item. This hash is being used to differentiate expense records stored in database. Should
// be unique for each expense record.
ExpenseItem.prototype.GetHash = function() {

    var hashBase = '';
    if (this.TransactionId != null && this.TransactionId.length > 0 && this.LogConfiguration.RecurringTransactionIds.indexOf(this.TransactionId) == -1)
    {
        hashBase = this.AccountId + '-' + this.TransactionId;
    }
    else {
        hashBase = this.AccountId + '-' + this.Title + this.Date.Display + this.Amount.Value;
    }

    return CryptoJS.MD5(hashBase);
}
