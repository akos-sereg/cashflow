Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
]);

var expenseDataGridStore = Ext.create('Ext.data.JsonStore', {
    fields: [
       {name: 'Date'},
       {name: 'Title'},
       {name: 'Amount', },
       {name: 'Location'}
    ]
});

var expenseDataGrid = Ext.create('Ext.grid.Panel', {
    store: expenseDataGridStore,
    margins: '10 10 10 10',
    columns: [
        {
            text     : 'Date',
            width    : 75,
            sortable : false,
            dataIndex: 'expense_date',
        },
        {
            text     : 'Type',
            flex     : 1,
            sortable : true,
            dataIndex: 'type'
        },
        {
            text     : 'Amount',
            width    : 75,
            sortable : true,
            dataIndex: 'expense_value'
        },
        {
            text     : 'Location',
            flex     : 1,
            sortable : true,
            dataIndex: 'location'
        },
        {
            text     : 'Tag',
            flex     : 1,
            sortable : true,
            dataIndex: 'tag'
        }
    ],
    height: 650,
    width: 1200,
    title: 'Expense List',
    viewConfig: {
        stripeRows: false
    },
    load: function(startDate, endDate) {
        $.ajax({
            type: 'GET',
            url: '/api/getExpenses?startDate=' + startDate + '&endDate=' + endDate,
            success: function(data) {

                expenseDataGrid.store.loadData(data);
            },
            contentType: 'application/json; charset=utf-8'
        });
    }
});
