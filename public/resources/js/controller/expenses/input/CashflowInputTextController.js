Ext.define('Cashflow.controller.expenses.input.CashflowInputTextController', {
    extend: 'Ext.app.Controller',
    //views: ['Cashflow.view.expenses.input.CashflowInputText'],
    getViewInstance: function () {
        return cashflowInput;
    },

    getView: function () {
        return cashflowInput;
    },

    onInput: function(logEntry, newValue, oldValue, eOpts) {
        var expenseParser = new ExpenseParser();
        cashflowGrid.store.loadData(expenseParser.Parse(newValue));
    },

    onLaunch: function(application) {
    }
});
