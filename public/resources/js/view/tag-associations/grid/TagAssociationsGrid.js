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
var tagAssociationsGrid = Ext.create('Ext.grid.Panel', {
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
            renderer : renderDeleteIcon
        }
    ],
    height: 350,
    width: 1200,
    border: true,
    viewConfig: {
        stripeRows: false
    },
    load: function() {
        $.ajax({
            type: 'GET',
            url: '/api/getTagAssociations',
            success: function(data) {
                console.log('Tag Association list loaded from server: ' + data.length + ' records.');
                tagAssociationsGrid.store.loadData(data);
                tagAssociationsGrid.store.rawData = data;
            },
            contentType: 'application/json; charset=utf-8'
        });
    },
    removeTagAssociation: function(ruleId) {
         $.ajax({
            type: 'POST',
            url: '/api/removeTagAssociation',
            data: { ruleId: ruleId },
            success: function(data) {

                if (data.isSuccess) {
                    tagAssociationsGrid.load();
                    return;
                }

                console.log(data.errorMessage);
            },
            contentType: 'application/x-www-form-urlencoded'
        });
    }
});

function renderDeleteIcon(value) {

    return '<img style="cursor: cursor; cursor: hand;" '
    + ' onClick=\'tagAssociationsGrid.removeTagAssociation(' + value + ')\''
    + ' src="resources/images/delete.png">';
}

tagAssociationsGrid.load();