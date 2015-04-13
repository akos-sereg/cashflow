Ext.define('Cashflow.controller.expenses.input.InputGridController', {
    extend: 'Ext.app.Controller',

    removeItem: function(index) {
        cashflowGrid.store.removeAt(index);
    },

});
