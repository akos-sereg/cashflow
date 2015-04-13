Ext.define('Cashflow.view.expenses.input.popup.UploadExpensesWindow', {
    extend: 'Ext.window.Window',

    height: 634,
    width: 840,
    layout: {
        type: 'border'
    },
    title: 'Upload expenses to server',
    closeable: true,

    initComponent: function () {

        var windowController = Ext.create('Cashflow.controller.expenses.input.popup.UploadExpensesWindowController');
        windowController.setView(this);

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
        windowController.sendExpenses();
    }
});