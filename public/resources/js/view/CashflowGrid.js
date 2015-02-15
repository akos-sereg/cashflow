Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
]);

function renderAmount(amount) {

    if (!isNaN(amount.Value)) {
        if (amount.Value > 0) {
            return '<span style="color: #009900;">' + amount.Display + '</span>';
        } else {
            return '<span style="color: #000000;">' + amount.Display + '</span>';
        }
    } else {
        return '<span style="color: #dd0000;">' + amount.Display + '</span>';
    }
}

function renderDate(date) {

    if (date.Value != null) {
        return '<span style="color: #000000;">' + date.Display + '</span>';
    } else {
        return '<span style="color: #dd0000;">' + date.Display + '</span>';
    }
}

// create the data store
var store = Ext.create('Ext.data.JsonStore', {
    fields: [
       {name: 'Date'},
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
            dataIndex: 'Date',
            renderer: renderDate
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
            renderer : renderAmount,
            dataIndex: 'Amount'
        },
        {
            text     : 'Location',
            flex     : 1,
            sortable : true,
            dataIndex: 'Location'
        }
    ],
    height: 650,
    width: 800,
    title: 'Expense List',
    viewConfig: {
        stripeRows: false
    }
});
