function TagSuggestionController() {

    // Load "suggestions" list from existing tag associations
    var tagAssociations = tagAssociationsGrid.store.rawData;
    this.suggestions = [];
    if (tagAssociations != null && tagAssociations != undefined) {
        for (var i=0; i!=tagAssociations.length; i++) {
            this.suggestions.push({contains: tagAssociations[i].pattern, tag: tagAssociations[i].label});
        }
    }

    this.configuration = {
        SuggestAlways : false           // Suggest even if expense record is already tagged
    };
}

TagSuggestionController.prototype.AttachSuggestions = function(expenseRecords) {

    if (expenseRecords == null || expenseRecords.length == 0) {
        return expenseRecords;
    }

    // Expense records
    for (var i=0; i!=expenseRecords.length; i++) {

        if (this.configuration.SuggestAlways == false && expenseRecords[i].tag != null && expenseRecords[i].tag.length > 0) {
            // Ignore suggestion, as record has tag already
            continue;
        }

        // Rules
        for (var j=0; j!=this.suggestions.length; j++) {

            // Running Contains rule
            if (this.suggestions[j].contains != null && this.suggestions[j].contains != '') {
                if (expenseRecords[i].location != null && expenseRecords[i].location.indexOf(this.suggestions[j].contains) > -1) {
                    expenseRecords[i].tag_suggestion = this.suggestions[j].tag;
                    expenseRecords[i].tag_suggestion_descriptor = expenseRecords[i].transactionId + ',' + this.suggestions[j].tag;
                }
            }
        }
    }

    return expenseRecords;
}
