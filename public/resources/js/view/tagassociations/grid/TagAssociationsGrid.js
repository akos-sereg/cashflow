Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
]);

// Initialize stores
// -------------------------------------------------------------------------------------
var tagAssociationsStore = Ext.create('Ext.data.JsonStore', {
    fields: [
       {name: 'Name'},
       {name: 'Location'},
       {name: 'Tag'}
    ]
});

// Components
// -------------------------------------------------------------------------------------
Ext.define('Cashflow.view.tagassociations.grid.TagAssociationsGrid', {
    extend: 'Ext.grid.Panel',
    store: tagAssociationsStore,
    margins: '0 0 0 0',
    title: 'Existing Associations',
    columns: [
        {
            text     : 'Rule Name',
            width    : 180,
            sortable : false,
            dataIndex: 'name',
        },
        {
            text     : 'Location (contains)',
            width    : 180,
            sortable : false,
            dataIndex: 'pattern',
        },
        {
            text     : 'Tag (association)',
            flex     : 1,
            sortable : true,
            dataIndex: 'label'
        },
        {
            text     : 'Remove',
            width    : 60,
            dataIndex: 'rule_id',
            renderer : function(ruleId) {
               return '<img style="cursor: cursor; cursor: hand;" '
               + ' onClick=\'Ext.getCmp("tag-associations-grid").showRemoveTagDialog(' + ruleId + ')\''
               + ' src="resources/images/delete.png">';
           }
        }
    ],
    height: 350,
    width: 1200,
    border: true,

    viewConfig: {
        stripeRows: false
    },

    showRemoveTagDialog: function(ruleId) {
        var me = this;
        Ext.MessageBox.confirm('Delete', 'Are you sure?', function(btn){
            if(btn === 'yes'){
                me.controller.removeTagAssociation(ruleId);
            }
        });
    },

    constructor: function(config) {
        this.callParent(arguments);
        this.controller = Ext.create('Cashflow.controller.tagassociations.grid.TagAssociationsGridController');
    }
});

