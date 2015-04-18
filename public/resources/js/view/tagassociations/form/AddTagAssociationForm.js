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
                Ext.getCmp('tag-associations-form').controller.addTagAssociation(
                    Ext.getCmp('tag-associations-form').getForm().findField('ruleName').getSubmitValue(),
                    Ext.getCmp('tag-associations-form').getForm().findField('pattern').getSubmitValue(),
                    Ext.getCmp('tag-associations-form').getForm().findField('tagLabel').getSubmitValue());
            }
        }
    }],

    clear: function() {
        Ext.getCmp('tag-associations-form').getForm().findField('ruleName').setValue('');
        Ext.getCmp('tag-associations-form').getForm().findField('pattern').setValue('');
    },

    constructor: function(config) {
        this.callParent(arguments);
        this.controller = Ext.create('Cashflow.controller.tagassociations.form.AddTagAssociationFormController');
    }
});