Ext.define('Cashflow.controller.expenses.input.popup.UploadExpensesWindowController', {
    extend: 'Ext.app.Controller',

    setView: function(view) {
        this.view = view;
    },

    sendExpenses: function() {
        var data = [];

        var cashflowGrid = Ext.getCmp('cashflow-grid');

        for (var i=0; i!=cashflowGrid.store.data.length; i++) {
            if (cashflowGrid.store.data.items[i].data.Valid) {
                cashflowGrid.store.data.items[i].data.Hash = cashflowGrid.store.data.items[i].data.GetHash().toString();
                data.push(cashflowGrid.store.data.items[i].data);
            }
        }

        $.ajax({
            type: 'POST',
            url: '/api/storeExpenses',
            data: JSON.stringify(data),
            success: function(data) {

                var message = '';
                for (var i=0; i!=data.length; i++) {
                    message += data[i] + '\r\n';
                }

                Ext.getCmp('uploadConsole').setValue(message);
            },
            contentType: 'application/json; charset=utf-8'
        });
    },
});
