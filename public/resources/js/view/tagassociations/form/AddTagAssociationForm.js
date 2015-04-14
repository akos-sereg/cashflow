Ext.define('Cashflow.view.tagassociations.form.AddTagAssociationForm', {
    extend: 'Ext.form.Panel',
    frame: true,
    title: 'Add new tag association',
    width: 550,
    margin: '10 0 0 0',
    fieldDefaults: {
        msgTarget: 'side',
        labelWidth: 120
    },
    defaultType: 'textfield',
    defaults: {
        anchor: '100%'
    },

    items: [{
        fieldLabel: 'Rule Name',
        name: 'ruleName',
    },
    {
        fieldLabel: 'Location Pattern',
        name: 'pattern'
    },
    {
        xtype: 'combobox',
        fieldLabel: 'Tag',
        displayField : 'label',
        valueField : 'label',
        name: 'tagLabel',
        store: tagStore,
        listeners: {
            focus: function(field) {

            },
            select: function (combobox, record, index) {

            }
        }
    }],

    buttons: [{
        text: 'Save',
        listeners: {
            click: function () {
                addTagAssociationFormController.addTagAssociation(
                    addTagAssociationForm.getForm().findField('ruleName').getSubmitValue(),
                    addTagAssociationForm.getForm().findField('pattern').getSubmitValue(),
                    addTagAssociationForm.getForm().findField('tagLabel').getSubmitValue());
            }
        }
    }],
    clear: function() {
        addTagAssociationForm.getForm().findField('ruleName').setValue('');
        addTagAssociationForm.getForm().findField('pattern').setValue('');
    }
});