Ext.define('Cashflow.store.ExpectedExpenseTypeStore', {
    extend: 'Ext.data.Store',
	autoLoad: true,

	fields: [
        {name: 'id', type: 'int'},
        {name: 'name', type: 'string'}
    ],

	proxy: {
        type: 'ajax',
        url: '/api/getExpectedExpenseTypes',
        reader: {
        	type: 'json',
        	root: 'data'
        }
    },

    listeners: {
    	load: function(){
    		console.log('Expected Expense Type store loaded');

            var table = Ext.getCmp('expected-expense-table');
            if (table != null) {
                table.configureTable(this.data.items);
            }
            else {
                console.error('Expected Expense Table is not loaded yet');
            }
    	}
    }
});