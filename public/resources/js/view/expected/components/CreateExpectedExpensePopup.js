Ext.define('Cashflow.view.expected.components.CreateExpectedExpensePopup', {
	extend: 'Ext.window.Window',
	title: 'Create expected expense item',
	bodyStyle: 'padding: 10 10 0 10px; background: #ffffff;',
	height: 200,
	width: 420,
	draggable: true,
	items: [
	{
		xtype: 'container', 
        layout: 'vbox', 
        height: 240,
        width: 380,
		items: [
		{
			xtype: 'textfield',
			id: 'expected-expense.name',
			fieldLabel: 'Name',
			width: 350,
			allowBlank: false,
		},
		{
	        xtype: 'combobox',
	        id: 'expected-expense.typeId',
	        fieldLabel: 'Type',
	        width: 300,
	        displayField: 'name',
	        valueField: 'id',
	        queryMode: 'local',
	        store: Ext.create('Cashflow.store.ExpectedExpenseTypeStore')
	    },
		{
	        xtype: 'datefield',
	        id: 'expected-expense.effectiveDate',
	        fieldLabel: 'Effective Date',
	        width: 300,
	        name: 'effectiveDate',
	        format: 'Y-m-d',
	        value: new Date(),
	        listeners: {
	            select: function(){
	            }
	        },
	    },
		{
			xtype: 'textfield',
			fieldLabel: 'Amount',
			id: 'expected-expense.amount',
			width: 220,
			allowBlank: false
		},
		{
            xtype: 'button',
            text: 'Create',
            padding: 5,
            margin: 3,
            handler : function() {
                var model = { 
                	name: Ext.getCmp('expected-expense.name').getValue(),
                	typeId: Ext.getCmp('expected-expense.typeId').getValue(),
                	effectiveDate: formatDate(Ext.getCmp('expected-expense.effectiveDate').getValue()),
                	amount: Ext.getCmp('expected-expense.amount').getValue(),
                };

                Ext.getCmp('expected-expenses-panel').controller.createExpectedExpense(model);
                this.up('window').destroy();
            }
        }]
	}],
});
