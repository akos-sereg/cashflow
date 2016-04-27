Ext.define('Cashflow.controller.expected.ExpectedExpensesPanelController', {
    extend: 'Ext.app.Controller',

    // Hardcoded values, represents ids from expencted_expense_type - defined in utils.js
    // TODO: to be requested from service
    expenseTypeIds: expenseTypeIds,

    currentDate: new Date(),

    onLaunch: function(application) { },

    onFocus: function() {
        var table = Ext.getCmp('expected-expense-table');
        table.reconfigure(undefined, table.columns);

		this.refresh();
    },

    refresh: function() {
        var me = this;

        $.ajax({
            type: 'GET',
            url: '/api/getExpectedExpenses?date=' + formatDate(me.currentDate),
            success: function(rawData) {

                Ext.getCmp('expected-expense-table').store.loadData(me.getMonthlyExpectedExpenses(rawData));
            },
            contentType: 'application/json; charset=utf-8'
        });
    },

    createExpectedExpense: function(item) {
        var me = this;
        $.ajax({
            type: 'POST',
            url: '/api/createExpectedExpense',
            data: JSON.stringify(item),
            dataType: 'json',
            success: function(rawData) {
                me.refresh();
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

    	var date = new Date(this.currentDate.getTime() + ((-3 * 30)*24*60*60*1000));
    	date.setDate(1);

    	var data = [];
        // Table skeleton, with dates
    	for (var i=0; i!=12; i++) {
    		var row = {};
    		date.setMonth(date.getMonth() + 1);
    		row['effective_date'] = date.toLocaleString('en-US', { month: 'long' });
    		row['year'] = date.getFullYear();
    		row['month'] = date.getMonth();
            row['total'] = 0;

            for (var j=0; j!=this.expenseTypeIds.length; j++) {
                row['expected_id_' + this.expenseTypeIds[j]] = [];
            }
    		
    		data.push(row);
    	}

        // Add items to cells in table (expected expenses)
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

        // Calculate total, rewrite dates to include total amount for month
        for (var i=0; i!=data.length; i++) {
            for (var j=0; j!=this.expenseTypeIds.length; j++) {
                data[i].total += this.getTotalForCell(data[i]['expected_id_' + this.expenseTypeIds[j]]);
            }

            data[i].effective_date += '<br/><br/><span style="float: right;">' + formatAmount(data[i].total) + ' Ft</span>';
        }

    	return data;
    },

    getTotalForCell: function(itemsInCell) {
        var total = 0;
        if (itemsInCell == undefined || itemsInCell == null) {
            return total;
        }

        for (var i=0; i!=itemsInCell.length; i++) {
            total += itemsInCell[i].amount;
        }

        return total;
    }
});

