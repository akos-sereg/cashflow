// -----------------------------------------------------------------------
// Tab pages
// -----------------------------------------------------------------------
var tabs = Ext.create('Ext.tab.Panel', {

    height: 600,
    listeners: {
        'tabchange': function(tabPanel, tab) {
            Ext.getCmp('cashflow-date-picker').controller.onRangeChanged();
        }
    },

    items: [
    {
        title: 'Input',
        region: 'center',
        layout: 'vbox',
        VBoxLayout:{
            margins: '10 10 10 10'
        },
        items: [
            Ext.create('Cashflow.view.expenses.input.CashflowInputText', { id: 'cashflow-input' }),
            Ext.create('Cashflow.view.expenses.input.InputGrid', { id: 'cashflow-grid' }),
            {
                layout: {
                    type: 'hbox',
                    pack: 'end'
                },
                width: 1165,
                align: 'right',
                border: false,
                items: [{
                    xtype: 'button',
                    margins: '5 5 5 5',
                    text : 'Send',
                    listeners: {
                        click: function () {
                            Ext.getCmp('expenses-panel').controller.onSendClicked();
                        }
                    }
                }, {
                    xtype: 'button',
                    margins: '5 5 5 5',
                    text : 'Parsing Configuration'
                }]
            }
        ]
    },
    {
        title: 'Persisted Data',
        region: 'center',
        layout: 'vbox',
        id: 'dataTab',
        VBoxLayout:{
            margins: '10 10 10 10'
        },
        items: [
            Ext.create('Cashflow.view.expenses.grid.ExpenseDataGrid', { id: 'cashflow-expense-grid' })
        ]
    },
    {
        title: 'Graphs',
        region: 'center',
        layout: 'vbox',
        id: 'graphTab',
        VBoxLayout:{
            margins: '10 10 10 10'
        },
        items: [
            Ext.create('Cashflow.view.expenses.charts.ExpenseGraph', { id: 'cashflow-chart' }),
            {
                layout: {
                    type: 'hbox'
                },
                width: 1165,
                align: 'left',
                border: false,
                items: [
                    Ext.create('Cashflow.view.expenses.charts.PieChart', { id: 'cashflow-pie-chart' }),
                    Ext.create('Cashflow.view.expenses.charts.BarChart', { id: 'cashflow-bar-chart' })
                ]
            }
        ]
    }]
});

Ext.define('Cashflow.view.expenses.ExpensesPanel', {
    extend     :'Ext.form.Panel',
    border     : false,
    anchor     : '100%',
    margins: '0 0 0 0',
    constructor: function(config) {
        this.callParent(arguments);
        this.controller = Ext.create('Cashflow.controller.expenses.ExpensesPanelController');
    },
    items: [{
        layout: {
            type: 'hbox'
        },
        width: 800,
        align: 'left',
        border: false,
        items: [
            Ext.create('Cashflow.view.expenses.navigation.DateRangePicker', { id: 'cashflow-date-picker' }),
            {
                xtype: 'button',
                margins: '5 5 5 5',
                text : '-1 Month',
                listeners: {
                    click: function () {
                        Ext.getCmp('cashflow-date-picker').addMonths(-1);
                    }
                }
            },
            {
                xtype: 'button',
                margins: '5 5 5 5',
                text : '+1 Month',
                listeners: {
                    click: function () {
                        Ext.getCmp('cashflow-date-picker').addMonths(1);
                    }
                }
            },
            {
                xtype: 'button',
                margins: '5 5 5 5',
                text : '-1 Quarter',
                listeners: {
                    click: function () {
                        Ext.getCmp('cashflow-date-picker').addMonths(-3);
                    }
                }
            },
            {
                xtype: 'button',
                margins: '5 5 5 5',
                text : '+1 Quarter',
                listeners: {
                    click: function () {
                        Ext.getCmp('cashflow-date-picker').addMonths(3);
                    }
                }
            },
            {
                xtype: 'button',
                margins: '5 5 5 5',
                text : '-1 Half Year',
                listeners: {
                    click: function () {
                        Ext.getCmp('cashflow-date-picker').addMonths(-6);
                    }
                }
            },
            {
                xtype: 'button',
                margins: '5 5 5 5',
                text : '+1 Half Year',
                listeners: {
                    click: function () {
                        Ext.getCmp('cashflow-date-picker').addMonths(6);
                    }
                }
            }
        ]
    },
    tabs],

});