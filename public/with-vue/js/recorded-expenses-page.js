var RecordedExpensesPage = {

	components: null,

	initialize: function() {
		this.readComponents();

		this.loadTable();
	},

	readComponents: function() {
        this.components = {
            dateRangeSelector: {
                startDate: $('#startDate'),
                endDate: $('#endDate'),
            },
            
        };
    },

    loadTable: function() {
    	$.ajax({
            type: 'GET',
            url: '/api/getExpenses?startDate=' + this.components.dateRangeSelector.startDate.val() + '&endDate=' + this.components.dateRangeSelector.endDate.val(),
            success: function(data) {

                app.recordedExpenses = data;
            },
            contentType: 'application/json; charset=utf-8'
        });
    }

}