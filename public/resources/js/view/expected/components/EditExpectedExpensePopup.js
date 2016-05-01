Ext.define('Cashflow.view.expected.components.EditExpectedExpensePopup', {
	extend: 'Ext.window.Window',
	xtype: 'edit-expected-expense-window',
	title: 'Edit expected expense item',
	bodyStyle: 'padding: 10 10 0 10px; background: #ffffff;',
	height: 200,
	width: 420,
	draggable: true,

	data: {},

	populate: function(id, status, name, effectiveDate, amount) {
		console.log('Populated: ' + id);
		this.data = { 
			id: id, 
			status: status,
			name: name,
			effectiveDate: effectiveDate,
			amount: amount
		};

		Ext.getCmp('editExpectedExpense.name').setText(name);
		Ext.getCmp('editExpectedExpense.effectiveDate').setText(formatDate(effectiveDate));
		Ext.getCmp('editExpectedExpense.amount').setText(formatAmount(amount) + 'Ft');
	},

	items: [
	{
		xtype: 'container', 
        layout: 'vbox', 
        height: 240,
        width: 380,
		items: [
		{
			xtype: 'container', 
	        layout: 'hbox', 
	        height: 30,
	        width: 380,
	        items: [
        	{ xtype: 'label', text: 'Name', width: 120 },
        	{ xtype: 'label', text: 'N/A', id: 'editExpectedExpense.name' }]
		},
		{
			xtype: 'container', 
	        layout: 'hbox', 
	        height: 30,
	        width: 380,
	        items: [
        	{ xtype: 'label', text: 'Effective Date', width: 120 },
        	{ xtype: 'label', text: 'N/A', id: 'editExpectedExpense.effectiveDate' }]
		},
		{
			xtype: 'container', 
	        layout: 'hbox', 
	        height: 30,
	        width: 380,
	        items: [
        	{ xtype: 'label', text: 'Amount', width: 120 },
        	{ xtype: 'label', text: 'N/A', id: 'editExpectedExpense.amount'}]
		},
		{
			xtype: 'container', 
	        layout: 'hbox', 
	        height: 240,
	        width: 380,
	        items: [
	        {
	            xtype: 'button',
	            text: 'Toggle State',
	            padding: 5,
	            margin: 3,
	            handler : function() {

					var parentComponent = Ext.ComponentQuery.query('edit-expected-expense-window')[0];
					var me = this;

			        Ext.MessageBox.confirm('Change Status', 'Are you sure you want to change status?', function(btn){
			            if(btn === 'yes'){
			                
			                var request = { 
			                	itemId: parentComponent.data.id, 
			                	status: parentComponent.data.status 
			                };

			                $.ajax({
			                    type: 'POST',
			                    url: '/api/setExpectedExpenseStatus',
			                    data: JSON.stringify(request),
			                    dataType: 'json',
			                    contentType: 'application/json; charset=utf-8',
			                    success: function(rawData) {
			                        Ext.getCmp('expected-expenses-panel').controller.refresh();
			                        me.up('window').destroy();
			                    }
			                });
			            }
			         });
	            }
	        },
	        {
	            xtype: 'button',
	            text: 'Delete',
	            padding: 5,
	            margin: 3,
	            handler : function() {
	                this.up('window').destroy();
	            }
	        }]
		}]
	}],
});
