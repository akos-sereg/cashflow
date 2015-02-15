Ext.define('Cashflow.view.UploadExpensesWindow', {
    extend: 'Ext.window.Window',

    height: 334,
    width: 540,
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
        var message = '';
        for (var i=0; i!=cashflowGrid.store.data.length; i++) {
            message += cashflowGrid.store.data.items[i].data.GetHash() + ' for '+ cashflowGrid.store.data.items[i].data.GetHashBase() +' \r\n';
        }

        Ext.getCmp('uploadConsole').setValue(message);
    }
});