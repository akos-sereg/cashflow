Ext.define('Cashflow.controller.expected.ExpectedExpensesPanelController', {
    extend: 'Ext.app.Controller',

    onLaunch: function(application) {
    },

    onFocus: function() {
        Ext.getCmp('expected-expense-table').reconfigure(undefined, Ext.getCmp('expected-expense-table').columns);

		var me = this;

		$.ajax({
            type: 'GET',
            url: '/api/getExpectedExpenses',
            success: function(rawData) {

                Ext.getCmp('expected-expense-table').store.loadData(me.getMonthlyExpectedExpenses(rawData));
            },
            contentType: 'application/json; charset=utf-8'
        });
    },

    toggleExpectedExpenseStatus: function(id, status) {
        
        var me = this;
        Ext.MessageBox.confirm('Change Status', 'Are you sure you want to change status?', function(btn){
            if(btn === 'yes'){
                var request = { itemId: id, status: status };
                $.ajax({
                    type: 'POST',
                    url: '/api/setExpectedExpenseStatus',
                    data: JSON.stringify(request),
                    dataType: 'json',
                    success: function(rawData) {
                        me.onFocus();
                    },
                    contentType: 'application/json; charset=utf-8'
                });
            }
         });
    },

    getMonthlyExpectedExpenses: function(rawData) {

    	var date = new Date(new Date().getTime() + ((-3 * 30)*24*60*60*1000));
    	date.setDate(1);

    	var data = [];
    	for (var i=0; i!=9; i++) {
    		var row = {};
    		date.setMonth(date.getMonth() + 1);
    		row['effective_date'] = date.toLocaleString('en-US', { month: "long" });
    		row['year'] = date.getFullYear();
    		row['month'] = date.getMonth();
    		row['expected_id_1'] = [];
    		row['expected_id_2'] = [];
    		row['expected_id_3'] = [];
    		row['expected_id_4'] = [];

    		data.push(row);
    	}

    	for (var i=0; i!=rawData.length; i++) {

    		var itemDate = new Date(Date.parse(rawData[i].effective_date));

    		var row = null;
    		for (var j=0; j!=data.length; j++) {
    			if (data[j]['year'] == itemDate.getFullYear() && data[j]['month'] == itemDate.getMonth()) {
    				row = data[j];
    			}
    		}

    		if (row == null) {
    			console.log('Row not found for item date: ' + itemDate);
    			continue;
    		}

    		row[rawData[i].column_id].push(rawData[i]);
    	}

    	return data;
    }
});

