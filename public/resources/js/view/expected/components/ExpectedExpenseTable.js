Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
]);

// Initialize stores
// -------------------------------------------------------------------------------------
var expectedExpenseDataGridStore = Ext.create('Ext.data.JsonStore', {
    fields: [
       {name: 'Date'},
       {name: 'Title'},
       {name: 'Amount', },
       {name: 'Location'},
       {name: 'Tag'},
       {name: 'TagSuggestion'},
    ],
    proxy: {
        type: 'memory',
        reader: 'json',
        data: [
            {id: 1, key1: 'Foo'},
            {id: 2, key2: 'Bar'},
            {id: 3, key2: 'Baz'}
        ]
    }
});

// Components
// -------------------------------------------------------------------------------------
//var expenseDataGrid = Ext.create('Ext.grid.Panel', {
Ext.define('Cashflow.view.expected.components.ExpectedExpenseTable', {
    extend: 'Ext.grid.Panel',
    store: expectedExpenseDataGridStore,
    margins: '1 1 1 1',
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        })
    ],
    columns: [],
    height: 550,
    width: 1200,
    border: false,
    scroll: false, // using native scrolling, as ExtJS' grid scrolling is buggy in v4
    viewConfig: {
        getRowClass: function(record) { 
            return 'expected-expense-row'; 
        },
        stripeRows: false
    },

    configureTable: function(items) {
        this.columns = [];

        for(var i=0; i!=items.length; i++) {
            console.log('Adding column: ' + items[i].data.name);
            this.columns.push( {
                header: items[i].data.name,
                dataIndex: 'key' + i,
                width: 200,
            });
        }

        this.reconfigure(undefined, this.columns);
    },

    constructor: function(config) {
        this.callParent(arguments);

        var store = Ext.getCmp('expectedExpenseTypeStore');
        if (this.columns.length != 0) {
            console.log('Expected Expense Table: columns not loaded but store is available, configuring table');
            this.configureTable(store.data.items);
        }
        else {
            Ext.getCmp('expected-expense-table').reconfigure(undefined, Ext.getCmp('expected-expense-table').columns);
        }
    },
});
