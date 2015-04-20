Ext.define('Cashflow.controller.expenses.grid.ExpenseDataGridController', {
    extend: 'Ext.app.Controller',

    // Load existing expenses from server, in specified date range
    load: function(startDate, endDate) {

        this.startDate = startDate;
        this.endDate = endDate;

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

    // Reload existing expenses in last date range
    reload: function() {
        if (this.startDate == undefined || this.endDate == undefined) {
            console.log('Reload called on Expense Grid, but start date or end date is not defined (load was not called previously)');
            return;
        }

        this.load(this.startDate, this.endDate);
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

    // Remove existing (stored) item by transactionId
    removeTransaction: function(transactionId) {
        var formData = {
            transactionId: transactionId
        };

        var me = this;

        $.ajax({
            type: 'POST',
            url: '/api/removeTransaction',
            data: formData,
            success: function(data) {

                console.log('Transaction deleted from database: ' + transactionId);
                me.reload();
            },
            contentType: 'application/x-www-form-urlencoded'
        });
    }

});
