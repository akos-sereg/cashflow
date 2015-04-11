var navigationPanel = Ext.create('Ext.form.Panel', {
    border     : false,
    anchor     : '100%',
    margins: '0 0 0 0',
    items: [{
        xtype: 'button',
        icon: 'http://sencha.com/favicon.ico',
        text: 'Expenses',
        scale: 'medium',
        anchor: '100%',
    },
    {
        xtype: 'button',
        icon: 'http://sencha.com/favicon.ico',
        text: 'Tag associations',
        scale: 'medium',
        anchor: '100%',
        margin: '10 0 0 0'
    }],

});