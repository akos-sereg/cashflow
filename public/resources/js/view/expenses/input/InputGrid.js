Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
]);

// create the data store
var cashflowGridStore = Ext.create('Ext.data.JsonStore', {
    fields: [
       {name: 'Date'},
       {name: 'Title'},
       {name: 'Amount', },
       {name: 'Location'}
    ]
});

Ext.define('Cashflow.view.expenses.input.InputGrid', {
    extend: 'Ext.grid.Panel',
    store: cashflowGridStore,
    margins: '10 10 10 10',
    columns: [
        {
            text     : 'Date',
            width    : 75,
            sortable : false,
            dataIndex: 'Date',
            renderer: function(date) {
                return '<span style="color: #'+(date.Value != null ? '000000' : 'dd0000')+';">' + date.Display + '</span>';
            }
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
            renderer : function(amount) {
                if (!isNaN(amount.Value)) {
                    if (amount.Value > 0) {
                        return '<span style="color: #009900;">' + amount.Display + '</span>';
                    } else {
                        return '<span style="color: #000000;">' + amount.Display + '</span>';
                    }
                } else {
                    return '<span style="color: #dd0000;">' + amount.Display + '</span>';
                }
            },
            dataIndex: 'Amount'
        },
        {
            text     : 'Location',
            flex     : 1,
            sortable : true,
            dataIndex: 'Location'
        },
        {
            text     : 'Delete',
            width    : 60,
            dataIndex: 'Hash',
            renderer : function(value, meta, record, rowIndex, colIndex, store, view) {
                return '<img style="cursor: cursor; cursor: hand;" '
                    + ' onClick=\'cashflowGridController.removeItem('+rowIndex+');\''
                    + ' src="resources/images/delete.png">';
            }
        },
    ],
    height: 380,
    width: 1165,
    title: 'Expense List',
    viewConfig: {
        stripeRows: false
    }
});
