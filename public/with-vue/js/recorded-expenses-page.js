var RecordedExpensesPage = {

	components: null,

	initialize: function() {
		this.readComponents();

        var self = this;
        this.components.recordSavings.date.datepicker({ dateFormat: 'yy-mm-dd' });
        this.components.importedCsvContent.bind('input propertychange', function() {
            self.importCsv();
        });
		
        this.loadTags(this.loadTable);
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
            },
            recordExpensesFromBankModal: $('#recordExpensesFromBankModal'),
            importedCsvContent: $('#importedCsvContent'),
        };
    },

    setTag: function(component) {

        var transactionId = component.attributes['data-transaction-id'].value;
        var selectedText = component.selectedOptions[0].text;
        var selectedId = Utils.getTagKey(selectedText);

        if (!selectedText || selectedId == null) {
             BootstrapDialog.alert({
                    type: BootstrapDialog.TYPE_DANGER,
                    title: 'Set Tag',
                    message: 'Tag has not been set, unknown tag selected'
             });

            return;
        }

        var formData = {
            tagLabel: selectedText,
            transactionId: transactionId
        };

        $.ajax({
            type: 'POST',
            url: '/api/setTag',
            data: formData,
            success: function(data) {
                BootstrapDialog.alert({
                    title: 'Set Tag',
                    message: 'Tag has been set successfully'
                });
                
            },
            contentType: 'application/x-www-form-urlencoded'
        });
    },

    loadTags: function(onSuccess) {
        $.ajax({
            type: 'GET',
            url: '/api/getTags',
            success: function(data) {
                app.tags = data;
                onSuccess();
            },
            contentType: 'application/json; charset=utf-8'
        });
    },

    importCsv: function() {
        
        var bankName = $('input[name=bankName]:checked').val();
        var logConfiguration = new OtpExpenseContentConfiguration();

        switch(bankName) {

            case 'otp':
                logConfiguration = new OtpExpenseContentConfiguration();
                break;

            case 'raiffeisen':
                logConfiguration = new RaiffeisenExpenseContentConfiguration();
                break;
        }

        app.expensesFromBank = new ExpenseParser().Parse(this.components.importedCsvContent.val(), logConfiguration);
    },

    storeExpenses: function() {

        var data = app.expensesFromBank;
        data.forEach(function(item) {
            item.Hash = item.GetHash().toString();
        });

        var self = this;

        $.ajax({
            type: 'POST',
            url: '/api/storeExpenses',
            data: JSON.stringify(data),
            success: function(data) {

                var message = '';
                for (var i=0; i!=data.length; i++) {
                    message += data[i] + '<br/>';
                }

                self.components.recordExpensesFromBankModal.modal('hide');

                BootstrapDialog.alert({
                    title: 'Store expenses',
                    message: '<div class="cashflow-server-message">The following expenses have been stored: <br/><br/>'
                        + '<span style="font-family: Consolas; font-size: 8pt;">' + message + '</span></div>'
                });
            },
            contentType: 'application/json; charset=utf-8'
        });
    },

    showRecordSavingsModal: function() {
        this.components.recordSavings.date.val('');
        this.components.recordSavings.amount.val('');
		this.components.recordSavingsModal.modal();
    },

    showRecordExpensesFromBank: function() {
        this.components.importedCsvContent.val('');
        app.expensesFromBank = null;
        this.components.recordExpensesFromBankModal.modal();  
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

                BootstrapDialog.alert({
                    title: 'Record Savings',
                    message: 'Successfully stored.'
                });
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
            url: '/api/getExpenses?startDate=' + RecordedExpensesPage.components.dateRangeSelector.startDate.val() + '&endDate=' + RecordedExpensesPage.components.dateRangeSelector.endDate.val(),
            success: function(data) {

                app.recordedExpenses = data;
            },
            contentType: 'application/json; charset=utf-8'
        });
    }

}