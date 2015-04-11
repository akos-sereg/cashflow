var tagAssociationsPanel = Ext.create('Ext.form.Panel', {
    border     : false,
    anchor     : '100%',
    margins: '0 0 0 0',
    initialize: function() {
        console.log('Initializing tag associations panel');
    },
    items: [{
        layout: {
            type: 'hbox'
        },
        width: 800,
        align: 'left',
        border: false,
        items: [
            {
                xtype: 'button',
                margins: '5 5 5 5',
                text : 'asd'
            },
       ],
    }]
});