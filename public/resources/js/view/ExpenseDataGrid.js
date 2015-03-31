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

                                expenseDataGrid.setTag(selectedRows[0].data.transactionId, newValue);
                            }
                        }
                    },
                }
            }
        },
        {
            text     : 'Accept',
            width    : 60,
            dataIndex: 'tag_suggestion_descriptor', // "<transacrionId>,<suggestedTagLabel>"
            renderer : renderIcon
        },
        {
            text     : 'Tag Suggestion',
            flex     : 1,
            sortable : true,
            dataIndex: 'tag_suggestion'
        }
    ],
    height: 530,
    width: 1165,
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

                var tagSuggestionController = new TagSuggestionController();
                tagSuggestionController.AttachSuggestions(data)

                expenseDataGrid.store.loadData(data);
                expenseDataGrid.store.rawData = data;
            },
            contentType: 'application/json; charset=utf-8'
        });
    },
    setTag: function(transactionId, tagLabel) {

        var formData = {
            tagLabel: tagLabel,
            transactionId: transactionId
        };

        $.ajax({
            type: 'POST',
            url: '/api/setTag',
            data: formData,
            success: function(data) {

                console.log('Expense tag set successfully. Tag: ' + tagLabel + ', Transaction ID: ' + transactionId);

                // Update corresponding expense record
                for (var i=0; i!=expenseDataGrid.store.rawData.length; i++) {
                    if (expenseDataGrid.store.rawData[i].transactionId == transactionId) {
                        expenseDataGrid.store.rawData[i].tag = tagLabel;
                        expenseDataGrid.store.rawData[i].tag_suggestion = null;
                        expenseDataGrid.store.rawData[i].tag_suggestion_descriptor = null;
                    }
                }

                expenseDataGrid.store.loadData(expenseDataGrid.store.rawData);
            },
            contentType: 'application/x-www-form-urlencoded'
        });
    }
});

function renderIcon(value) {

    if (value != null && value != '') {

        var args = value.split(',');

        if (args == null || args.length != 2) {
            console.log('Warning: Invalid argument for "Tag suggestion descriptor": ' + value + '. Value should be in form "<transacrionId>,<suggestedTagLabel>"');
            console.log('Ignoring suggestion');
            return '';
        }

        return '<img style="cursor: cursor; cursor: hand;" '
        + ' onClick=\'expenseDataGrid.setTag(\"'+args[0]+'\", \"'+ args[1] +'\")\''
        + ' src="resources/images/green_check.png">';
    }
    else {
        return '';
    }
}