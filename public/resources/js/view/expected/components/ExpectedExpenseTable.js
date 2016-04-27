Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
]);

function createStore() {

    var fields = [{ name: 'effective_date' } ];
    
    for (var i=0; i!=expenseTypeIds.length; i++) {
        fields.push({ name: 'expected_id_' + expenseTypeIds[i] });
    }

    return Ext.create('Ext.data.JsonStore', { fields: fields });
}

// Components
// -------------------------------------------------------------------------------------
//var expenseDataGrid = Ext.create('Ext.grid.Panel', {
Ext.define('Cashflow.view.expected.components.ExpectedExpenseTable', {
    extend: 'Ext.grid.Panel',
    store: createStore(),
    margins: '1 1 1 1',
    columns: [],
    height: 810,
    width: 1200,
    border: false,
    scroll: false, // using native scrolling, as ExtJS' grid scrolling is buggy in v4
    viewConfig: {
        getRowClass: function(record) { 
            return 'expected-expense-row'; 
        },
        stripeRows: false
    },

    thresholdInDays: 15,

    configureTable: function(items) {
        var self = this;

        this.columns = [ { header: 'Effective Date', dataIndex: 'effective_date', width: 200 } ];

        for(var i=0; i!=items.length; i++) {
            var dataIndex = 'expected_id_' + items[i].data.id;
            this.columns.push( {
                header: items[i].data.name,
                dataIndex: dataIndex,
                width: 200,
                renderer: function(val) {

                    if (val == undefined || val.length == 0) {
                        return '';
                    }
                    
                    var itemsHtml = '<div style="position: float;">';
                    for (var j=0; j!=val.length; j++) {

                        var bg = '#EAEAEA';
                        var fontColor = '#000000';
                        var label = val[j].name;

                        var effectiveDate = Date.parse(val[j].effective_date);
                        var effectiveDateObj = new Date(effectiveDate);
                        var effectiveDateDaysFromEpoch = epochDays(effectiveDate);
                        var nowDaysFromEpoch = epochDays(new Date().getTime());

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
                        else if ((effectiveDateDaysFromEpoch - self.thresholdInDays) < nowDaysFromEpoch) {
                            // due in <thresholdInDays> days
                            bg = '#FF9800';
                            fontColor = '#ffffff';
                            label += ' (' + Math.ceil(Math.abs(nowDaysFromEpoch-effectiveDateDaysFromEpoch)) + ' days)';
                        }
                        
                        itemsHtml += '<span onClick="Ext.getCmp(\'expected-expenses-panel\').controller.toggleExpectedExpenseStatus('+val[j].id+', '+(val[j].paid === 1 ? 0 : 1)+')" title="Amount: '+formatAmount(val[j].amount)+' Ft, Effective: '+new Date(effectiveDate).toISOString().substring(0, 10)+'" style="float: left; margin: 3px; cursor: pointer; color: '+fontColor+'; border-radius: 50px; padding-top: 2px; padding-bottom: 2px; padding-right: 15px; padding-left: 15px; background-color: '+bg+';">' + label + '</span>';
                    }
                    itemsHtml += '</div>';

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
