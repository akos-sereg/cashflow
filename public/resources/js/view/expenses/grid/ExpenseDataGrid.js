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
       {name: 'Location'},
       {name: 'Tag'},
       {name: 'TagSuggestion'},
    ]
});

// Components
// -------------------------------------------------------------------------------------
//var expenseDataGrid = Ext.create('Ext.grid.Panel', {
Ext.define('Cashflow.view.expenses.grid.ExpenseDataGrid', {
    extend: 'Ext.grid.Panel',
    store: expenseDataGridStore,
    margins: '0 0 0 0',
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
                    focus: function(field) {
                        var selectedRows = Ext.getCmp('cashflow-expense-grid').getSelectionModel().getSelection();
                        if (selectedRows != null && selectedRows.length == 1) {
                            this.selectedTransactionId = selectedRows[0].data.transactionId;
                            console.log('Selected Row (transaction id) : ' + selectedRows[0].data.transactionId);
                        }
                    },
                    select: function (combobox, record, index) {
                        console.log('Setting tag "' + record[0].data.label + '" for transaction ' + this.selectedTransactionId);
                        Ext.getCmp('cashflow-expense-grid').controller.setTag(this.selectedTransactionId, record[0].data.label);

                        combobox.fireEvent('blur');
                    }
                }
            }
        },
        {
            text     : 'Accept',
            width    : 60,
            dataIndex: 'tag_suggestion_descriptor', // "<transacrionId>,<suggestedTagLabel>"
            renderer : function(value) {
                if (value != null && value != '') {
                    var args = value.split(',');

                    if (args == null || args.length != 2) {
                        console.log('Warning: Invalid argument for "Tag suggestion descriptor": ' + value + '. Value should be in form "<transacrionId>,<suggestedTagLabel>"');
                        console.log('Ignoring suggestion');
                        return '';
                    }

                    return '<img style="cursor: cursor; cursor: hand;" '
                        + ' onClick=\'this.getCmp("cashflow-expense-grid").controller.setTag(\"'+args[0]+'\", \"'+ args[1] +'\")\''
                        + ' src="resources/images/green_check.png">';
                }
                else {
                   return '';
                }
            }
        },
        {
            text     : 'Tag Suggestion',
            flex     : 1,
            sortable : true,
            dataIndex: 'tag_suggestion'
        }
    ],
    height: 550,
    width: 1200,
    border: false,
    scroll          : false, // using native scrolling, as ExtJS' grid scrolling is buggy in v4
    viewConfig      : {
        style: { overflow: 'auto', overflowX: 'hidden' },
        stripeRows: false
    },

    constructor: function(config) {
        this.callParent(arguments);
        this.controller = Ext.create('Cashflow.controller.expenses.grid.ExpenseDataGridController');
    }
});
