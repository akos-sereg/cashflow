var navigationPanel = Ext.create('Ext.form.Panel', {
    border     : false,
    anchor     : '100%',
    margins: '0 0 0 0',
    items: [{
        xtype: 'button',
        icon: '/resources/images/bar_chart.png',
        text: 'Expenses',
        scale: 'medium',
        anchor: '100%',
        handler : function() {
            expensesPanel.getEl().show();
            tagAssociationsPanel.getEl().hide();
        }
    },
    {
        xtype: 'button',
        icon: '/resources/images/icon-tags.png',
        text: 'Tag associations',
        scale: 'medium',
        anchor: '100%',
        margin: '10 0 0 0',

        handler : function() {

            expensesPanel.getEl().hide();
            tagAssociationsPanel.getEl().show();
        }
    }],

});