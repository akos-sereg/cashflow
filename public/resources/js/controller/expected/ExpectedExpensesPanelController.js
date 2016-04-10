Ext.define('Cashflow.controller.expected.ExpectedExpensesPanelController', {
    extend: 'Ext.app.Controller',

    onLaunch: function(application) {
    },

    onFocus: function() {
        Ext.getCmp('expected-expense-table').reconfigure(undefined, Ext.getCmp('expected-expense-table').columns);
    },

});
