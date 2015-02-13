Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*'
]);

/**
 * Custom function used for column renderer
 * @param {Object} val
 */
 /*
function change(val) {
    if (val > 0) {
        return '<span style="color:green;">' + val + '</span>';
    } else if (val < 0) {
        return '<span style="color:red;">' + val + '</span>';
    }
    return val;
}*/

// create the data store
var store = Ext.create('Ext.data.JsonStore', {
    fields: [
       {name: 'date'},
       {name: 'Title'},
       {name: 'Amount'},
       {name: 'Location'}
    ]
});

var cashflowGrid = Ext.create('Ext.grid.Panel', {
    store: store,
    stateful: true,
    stateId: 'stateGrid',
    margins: '10 10 10 10',
    columns: [
        {
            text     : 'Date',
            width    : 75,
            sortable : false,
            dataIndex: 'date'
        },
        {
            text     : 'Title',
            flex     : 1,
            sortable : true,
            dataIndex: 'Title'
        },
        {
            text     : 'Amount',
            width    : 75,
            sortable : true,
            //renderer : change,
            dataIndex: 'Amount'
        },
        {
            text     : 'Location',
            flex     : 1,
            sortable : true,
            dataIndex: 'Location'
        }
    ],
    height: 350,
    width: 800,
    title: 'Expense List',
    viewConfig: {
        stripeRows: true
    }
});