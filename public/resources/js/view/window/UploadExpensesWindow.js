Ext.define('Cashflow.view.UploadExpensesWindow', {
    extend: 'Ext.window.Window',

    height: 334,
    width: 540,
    layout: {
        type: 'border'
    },
    title: 'Run report',
    closeable: true,

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [{
                xtype: 'form',
                bodyPadding: 10,
                region: 'center'
            }]
        });

        me.callParent(arguments);
    }
});