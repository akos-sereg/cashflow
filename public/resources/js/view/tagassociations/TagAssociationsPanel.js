Ext.define('Cashflow.view.tagassociations.TagAssociationsPanel', {
    extend     :'Ext.form.Panel',
    border     : false,
    anchor     : '100%',
    items: [{
        anchor: '100%',
        align: 'left',
        border: false,
        items: [
            Ext.create('Cashflow.view.tagassociations.grid.TagAssociationsGrid', { id: 'tag-associations-grid' }),
            Ext.create('Cashflow.view.tagassociations.form.AddTagAssociationForm', { id: 'tag-associations-form' })
       ],
    }],
});