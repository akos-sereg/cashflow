Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
]);

// Initialize stores
// -------------------------------------------------------------------------------------
var expectedExpenseDataGridStore = Ext.create('Ext.data.JsonStore', {
    fields: [
       {name: 'effective_date'},
       {name: 'expected_id_1'},
       {name: 'expected_id_2'},
       {name: 'expected_id_3'},
       {name: 'expected_id_4'},
    ],
    /*proxy: {
        type: 'rest',
        url: '/api/getExpectedExpenses',
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json'
        }
    }*/
});

// Components
// -------------------------------------------------------------------------------------
//var expenseDataGrid = Ext.create('Ext.grid.Panel', {
Ext.define('Cashflow.view.expected.components.ExpectedExpenseTable', {
    extend: 'Ext.grid.Panel',
    store: expectedExpenseDataGridStore,
    margins: '1 1 1 1',
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
        this.columns = [ { header: 'Effective Date', dataIndex: 'effective_date', width: 200 } ];

        for(var i=0; i!=items.length; i++) {
            var dataIndex = 'expected_id_' + items[i].data.id;
            this.columns.push( {
                header: items[i].data.name,
                dataIndex: dataIndex,
                width: 200,
                renderer: function(val) {
                    if (val.length == 0) {
                        return '';
                    }
                    
                    var itemsHtml = '';
                    for (var j=0; j!=val.length; j++) {

                        var bg = '#EAEAEA';
                        var fontColor = '#000000';

                        var effectiveDate = Date.parse(val[j].effective_date);
                        if (val[j].paid == 1) {
                            // paid already
                            bg = '#07A800';
                            fontColor = '#ffffff';
                        }
                        else if (effectiveDate < (new Date().getTime())) {
                            // overdue
                            bg = '#CE000A';
                            fontColor = '#ffffff';
                        }
                        else if ((effectiveDate - (30 * 24 * 60 * 60 * 1000)) < (new Date().getTime())) {
                            // due in 30 days
                            bg = '#FF9800';
                            fontColor = '#ffffff';
                        }
                        
                        itemsHtml += '<span style="color: '+fontColor+'; border-radius: 50px; padding-top: 5px; padding-bottom: 5px; padding-right: 15px; padding-left: 15px; background-color: '+bg+';">' + val[j].name + ': ' + val[j].amount + ' ft</span>';
                        if (j != val.length-1) {
                            itemsHtml += '<br/><br/>';
                        }
                    }

                    return itemsHtml;
                }
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
