Ext.define('Cashflow.controller.expenses.grid.ExpenseDataGridController', {
    extend: 'Ext.app.Controller',

    // Load existing expenses from server, in specified date range
    load: function(startDate, endDate) {
        $.ajax({
            type: 'GET',
            url: '/api/getExpenses?startDate=' + startDate + '&endDate=' + endDate,
            success: function(data) {

                console.log('Expense list loaded from server: ' + data.length + ' records.');
                var expenseDataGrid = Ext.getCmp('cashflow-expense-grid');

                var tagSuggestionController = new TagSuggestionController();
                tagSuggestionController.AttachSuggestions(data)

                expenseDataGrid.store.loadData(data);
                expenseDataGrid.store.rawData = data;
            },
            contentType: 'application/json; charset=utf-8'
        });
    },

    // Assign (or update) tag for expense item
    setTag: function(transactionId, tagLabel) {

        var formData = {
            tagLabel: tagLabel,
            transactionId: transactionId
        };

        $.ajax({
            type: 'POST',
            url: '/api/setTag',
            data: formData,
            success: function(data) {

                console.log('Expense tag set successfully. Tag: ' + tagLabel + ', Transaction ID: ' + transactionId);
                var expenseDataGrid = Ext.getCmp('cashflow-expense-grid');

                // Update corresponding expense record
                for (var i=0; i!=expenseDataGrid.store.rawData.length; i++) {
                    if (expenseDataGrid.store.rawData[i].transactionId == transactionId) {
                        expenseDataGrid.store.rawData[i].tag = tagLabel;
                        expenseDataGrid.store.rawData[i].tag_suggestion = null;
                        expenseDataGrid.store.rawData[i].tag_suggestion_descriptor = null;
                    }
                }

                expenseDataGrid.store.loadData(expenseDataGrid.store.rawData);
            },
            contentType: 'application/x-www-form-urlencoded'
        });
    },

});
