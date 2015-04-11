// -----------------------------------------------------------------------
// Tab pages
// -----------------------------------------------------------------------
var tabs = Ext.create('Ext.tab.Panel', {
    height: 600,
    listeners: {
        'tabchange': function(tabPanel, tab) {
            dateRangePicker.onRangeChanged();
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
            cashflowInput,
            cashflowGrid,
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
                            Ext.create('Cashflow.view.UploadExpensesWindow').show();
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
            expenseDataGrid
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
            cashflowChart,
            {
                layout: {
                    type: 'hbox'
                },
                width: 1165,
                align: 'left',
                border: false,
                items: [
                    pieChart,
                    barChart
                ]
            }
        ]
    }]
});


var expensesPanel = Ext.create('Ext.form.Panel', {
    border     : false,
    anchor     : '100%',
    margins: '0 0 0 0',
    items: [{
        layout: {
            type: 'hbox'
        },
        width: 800,
        align: 'left',
        border: false,
        items: [
            dateRangePicker,
            {
                xtype: 'button',
                margins: '5 5 5 5',
                text : '-1 Month',
                listeners: {
                    click: function () {
                        dateRangePicker.addMonths(-1);
                    }
                }
            },
            {
                xtype: 'button',
                margins: '5 5 5 5',
                text : '+1 Month',
                listeners: {
                    click: function () {
                        dateRangePicker.addMonths(1);
                    }
                }
            },
            {
                xtype: 'button',
                margins: '5 5 5 5',
                text : '-1 Quarter',
                listeners: {
                    click: function () {
                        dateRangePicker.addMonths(-3);
                    }
                }
            },
            {
                xtype: 'button',
                margins: '5 5 5 5',
                text : '+1 Quarter',
                listeners: {
                    click: function () {
                        dateRangePicker.addMonths(3);
                    }
                }
            },
            {
                xtype: 'button',
                margins: '5 5 5 5',
                text : '-1 Half Year',
                listeners: {
                    click: function () {
                        dateRangePicker.addMonths(-6);
                    }
                }
            },
            {
                xtype: 'button',
                margins: '5 5 5 5',
                text : '+1 Half Year',
                listeners: {
                    click: function () {
                        dateRangePicker.addMonths(6);
                    }
                }
            }
        ]
    },
    tabs],

});