Ext.define('Cashflow.controller.expenses.input.CashflowInputTextController', {
    extend: 'Ext.app.Controller',

    onInput: function(logEntry, newValue, oldValue, eOpts) {
        var expenseParser = new ExpenseParser();
        Ext.getCmp('cashflow-grid').store.loadData(expenseParser.Parse(newValue));
    },
});
