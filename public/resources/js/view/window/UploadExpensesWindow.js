Ext.define('Cashflow.view.UploadExpensesWindow', {
    extend: 'Ext.window.Window',

    height: 634,
    width: 840,
    layout: {
        type: 'border'
    },
    title: 'Upload expenses to server',
    closeable: true,

    initComponent: function () {

        // Build Component
        var me = this;
        Ext.applyIf(me, {
            items: [{
                xtype: 'textareafield',
                id: 'uploadConsole',
                height: 200,
                bodyPadding: 10,
                region: 'center'
            }]
        });

        me.callParent(arguments);

        // Start Uploading ...
        var data = [];

        for (var i=0; i!=cashflowGrid.store.data.length; i++) {
            cashflowGrid.store.data.items[i].data.Hash = cashflowGrid.store.data.items[i].data.GetHash().toString();
            data.push(cashflowGrid.store.data.items[i].data);
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

        //Ext.getCmp('uploadConsole').setValue(message);
    }
});