var ExpectedExpensesPage = {

	components: {
		modifyUpcomingExpenseModal: null
	},

	// Hardcoded values of expected expense types
	expenseTypeIds: [ 1, 2, 3, 4, 5 ],

	currentDate: new Date(),

	initialize: function() {
		app.upcomingExpenseTypes = this.expenseTypeIds;
		this.readComponents();
		this.refresh();
	},

	readComponents: function() {
		this.components.modifyUpcomingExpenseModal = $('#modifyUpcomingExpense');
	},

	setPaid: function(itemId, state) {

		var self = this;
		
		$.ajax({
            type: 'POST',
            url: '/api/setExpectedExpenseStatus',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({itemId: itemId, status: state}),
            success: function(rawData) {

                self.refresh();
                self.components.modifyUpcomingExpenseModal.modal('hide');
            }
        });
	},

	refresh: function() {

		var self = this;

		$.ajax({
            type: 'GET',
            url: '/api/getExpectedExpenses?date=' + Utils.formatDate(self.currentDate),
            contentType: 'application/json; charset=utf-8',
            success: function(rawData) {

                app.upcomingExpenses = self.getMonthlyExpectedExpenses(rawData);
                
                setTimeout(function(){ 
                	$('[data-toggle="tooltip"]').tooltip();
                }, 300);
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

            data[i].total_amount = Utils.formatAmount(data[i].total);
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
}