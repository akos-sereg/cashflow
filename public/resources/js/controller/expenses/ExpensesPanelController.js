Ext.define('Cashflow.controller.expenses.ExpensesPanelController', {
    extend: 'Ext.app.Controller',

    onSendClicked: function() {
        Ext.create('Cashflow.view.expenses.input.popup.UploadExpensesWindow').show();
    },

    onLaunch: function(application) {
    }
});
