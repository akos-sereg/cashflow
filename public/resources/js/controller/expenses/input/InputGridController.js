Ext.define('Cashflow.controller.expenses.input.InputGridController', {
    extend: 'Ext.app.Controller',

    removeItem: function(index) {
        Ext.getCmp('cashflow-grid').store.removeAt(index);
    },

});
