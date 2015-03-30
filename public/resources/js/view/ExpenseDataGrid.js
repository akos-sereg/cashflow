Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
]);

// Initialize stores
// -------------------------------------------------------------------------------------
var expenseDataGridStore = Ext.create('Ext.data.JsonStore', {
    fields: [
       {name: 'Date'},
       {name: 'Title'},
       {name: 'Amount', },
       {name: 'Location'}
    ]
});

var tagStore = Ext.create('Ext.data.Store', {
	autoLoad: true,
	fields: [
        {name: 'id', type: 'int'},
        {name: 'label', type: 'string'}
    ],
	proxy: {
        type: 'ajax',
        url: '/api/getTags',
        reader: {
        	type: 'json',
        	root: 'data'
        }
    },
    listeners: {
    	load: function(){
    		console.log('Tag store loaded');
    	}
    }
});

// Components
// -------------------------------------------------------------------------------------
var expenseDataGrid = Ext.create('Ext.grid.Panel', {
    store: expenseDataGridStore,
    margins: '10 10 10 10',
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        })
    ],
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
            header: 'Tag',
            dataIndex: 'tag',
            width: 200,
            editor: {
                xtype: 'combobox',
                displayField : 'label',
                valueField : 'label',
                store: tagStore,
                listeners: {
                    change: function(ele, newValue, oldValue) {
                        if (newValue != null) {

                            console.log('Tag selected for expense item: ' + newValue);

                            var selectedRows = expenseDataGrid.getSelectionModel().getSelection();
                            if (selectedRows != null && selectedRows.length == 1) {

                                // Update tag for expense item
                                var formData = {
                                    tagLabel: newValue,
                                    transactionId: selectedRows[0].data.transactionId
                                };

                                $.ajax({
                                    type: 'POST',
                                    url: '/api/setTag',
                                    data: formData,
                                    success: function(data) {

                                        console.log('Expense tag set successfully. Tag: ' + newValue + ', Transaction ID: ' + selectedRows[0].data.transactionId);
                                    },
                                    contentType: 'application/x-www-form-urlencoded'
                                });

                            }
                        }
                    },
                }
            }
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

                console.log('Expense list loaded from server: ' + data.length + ' records.');
                expenseDataGrid.store.loadData(data);
            },
            contentType: 'application/json; charset=utf-8'
        });
    }
});
