var tagAssociationsPanel = Ext.create('Ext.form.Panel', {
    border     : false,
    anchor     : '100%',
    margins: '0 0 0 0',
    initialize: function() {
        console.log('Initializing tag associations panel');
    },
    items: [{
        anchor: '100%',
        align: 'left',
        border: false,
        items: [
            tagAssociationsGrid
       ],
    }]
});