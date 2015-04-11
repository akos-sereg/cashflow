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
    ],
    height: 350,
    width: 1200,
    border: true,
    viewConfig: {
        stripeRows: false
    },
    load: function(startDate) {
        $.ajax({
            type: 'GET',
            url: '/api/getTagAssociations',
            success: function(data) {
                console.log('Tag Association list loaded from server: ' + data.length + ' records.');
                tagAssociationsGrid.store.loadData(data);
            },
            contentType: 'application/json; charset=utf-8'
        });
    },
});

tagAssociationsGrid.load();