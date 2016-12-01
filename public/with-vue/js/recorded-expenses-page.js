var RecordedExpensesPage = {

	components: null,

	initialize: function() {
		this.readComponents();

        this.components.recordSavings.date.datepicker({ dateFormat: 'yy-mm-dd' });

		this.loadTable();
	},

	readComponents: function() {
        this.components = {
            dateRangeSelector: {
                startDate: $('#startDate'),
                endDate: $('#endDate'),
            },
            recordSavingsModal: $('#recordSavingModal'),
            recordSavings: {
                date: $('#savingsTransferredDate'),
                amount: $('#savingsAmount'),
            }
        };
    },

    showRecordSavingsModal: function() {
        this.components.recordSavings.date.val('');
        this.components.recordSavings.amount.val('');
		this.components.recordSavingsModal.modal();
    },

    recordSavings: function() {

        var self = this;

        $.ajax({
            type: 'POST',
            url: '/api/recordSavings',
            data: JSON.stringify({ 
                savingsAmount: self.components.recordSavings.amount.val().replaceAll(' ', '').replaceAll('.', ''), 
                savingsDate: self.components.recordSavings.date.val()
            }),
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                self.components.recordSavingsModal.modal('hide');
            },
        });

    },

    savingsAmountKeyUp: function() {
      var number =this.components.recordSavings.amount.val().replaceAll(' ', '').replaceAll('.', '');
      if (!isNaN(number)) {
        this.components.recordSavings.amount.val(Utils.formatAmount(number));
      }
      else {
        this.components.recordSavings.amount.val(''); 
      }
      
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