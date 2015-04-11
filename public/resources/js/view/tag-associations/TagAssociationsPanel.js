var tagAssociationsPanel = Ext.create('Ext.form.Panel', {
    border     : false,
    anchor     : '100%',
    items: [{
        anchor: '100%',
        align: 'left',
        border: false,
        items: [
            tagAssociationsGrid,
            addTagAssociationForm
       ],
    }]
});