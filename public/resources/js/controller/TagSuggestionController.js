function TagSuggestionController() {
    this.suggestions = [
        { contains: 'Magyar Telekom Nyrt.', tag: 'Mobile' },
        { contains: 'CBA KRISZTINA BUDAPEST', tag: 'Bevasarlas' },
    ];
}

TagSuggestionController.prototype.AttachSuggestions = function(expenseRecords) {

    if (expenseRecords == null || expenseRecords.length == 0) {
        return expenseRecords;
    }

    // Expense records
    for (var i=0; i!=expenseRecords.length; i++) {

        // Rules
        for (var j=0; j!=this.suggestions.length; j++) {

            // Running Contains rule
            if (this.suggestions[j].contains != null && this.suggestions[j].contains != '') {
                if (expenseRecords[i].location.indexOf(this.suggestions[j].contains) > -1) {
                    expenseRecords[i].tag_suggestion = this.suggestions[j].tag;
                    expenseRecords[i].tag_suggestion_descriptor = expenseRecords[i].transactionId + ',' + this.suggestions[j].tag;
                }
            }
        }
    }

    return expenseRecords;
}
