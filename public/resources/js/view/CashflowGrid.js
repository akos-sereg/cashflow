Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
]);

/**
 * Custom function used for column renderer
 * @param {Object} val
 */
function change(amount) {

    if (!isNaN(amount.Value)) {
        return '<span style="color: #000000;">' + amount.Display + '</span>';
    } else {
        return '<span style="color: #dd0000;">' + amount.Display + '</span>';
    }
    return val;
}

// create the data store
var store = Ext.create('Ext.data.JsonStore', {
    fields: [
       {name: 'date'},
       {name: 'Title'},
       {name: 'Amount', },
       {name: 'Location'}
    ]
});

var cashflowGrid = Ext.create('Ext.grid.Panel', {
    store: store,
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
            renderer : change,
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
        stripeRows: false
    }
});
