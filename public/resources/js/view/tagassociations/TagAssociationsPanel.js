var addTagAssociationForm = Ext.create('Cashflow.view.tagassociations.form.AddTagAssociationForm');
var addTagAssociationFormController = Ext.create('Cashflow.controller.tagassociations.form.AddTagAssociationFormController');
var tagAssociationsGrid = Ext.create('Cashflow.view.tagassociations.grid.TagAssociationsGrid');
var tagAssociationsGridController = Ext.create('Cashflow.controller.tagassociations.grid.TagAssociationsGridController');

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
    }],
});