Ext.define('Cashflow.view.expected.ExpectedExpensesPanel', {
    extend     :'Ext.form.Panel',
    border     : false,
    anchor     : '100%',
    items: [{
        anchor: '100%',
        align: 'left',
        border: false,
        items: [
            Ext.create('Cashflow.view.expected.components.ExpectedExpenseTable', { id: 'expected-expense-table' })
       ],
    }],

    constructor: function(config) {
        this.callParent(arguments);
        this.controller = Ext.create('Cashflow.controller.expected.ExpectedExpensesPanelController');
    },
});