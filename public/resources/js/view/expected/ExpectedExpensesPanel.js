Ext.define('Cashflow.view.expected.ExpectedExpensesPanel', {
    extend     :'Ext.form.Panel',
    border     : false,
    anchor     : '100%',
    items: [{
        anchor: '100%',
        align: 'left',
        border: false,
        items: [
            {
                xtype:'container', 
                layout:'hbox', 
                items:[
                {
                    xtype: 'button',
                    text: '-1 Month',
                    padding: 5,
                    margin: 3,
                    handler : function(){
                        var controller = Ext.getCmp('expected-expenses-panel').controller;
                        controller.currentDate = controller.currentDate.addDays(-30);
                        controller.refresh();
                    }
                },
                {
                    xtype: 'button',
                    text: '+1 Month',
                    padding: 5,
                    margin: 3,
                    handler : function(){
                        var controller = Ext.getCmp('expected-expenses-panel').controller;
                        controller.currentDate = controller.currentDate.addDays(30);
                        controller.refresh();
                    }
                }]
            },
            Ext.create('Cashflow.view.expected.components.ExpectedExpenseTable', { id: 'expected-expense-table' })
       ],
    }],

    constructor: function(config) {
        this.callParent(arguments);
        this.controller = Ext.create('Cashflow.controller.expected.ExpectedExpensesPanelController');
    },
});