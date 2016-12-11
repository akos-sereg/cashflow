var RecordedExpensesPage = {

	components: null,

    htmlParts: [ 
        { target: 'recorded-page', path: 'html_templates/recorded-expenses-page.html', append: false },
        { target: 'modal-container', path: 'html_templates/dialog/import-expenses-modal.html', append: true }, 
        { target: 'modal-container', path: 'html_templates/dialog/record-saving-modal.html', append: true }
    ],

    loadHtmlParts: function(initContext, next) {

        new HtmlPartsLoader(RecordedExpensesPage.htmlParts).load(initContext, next);
    },

	initialize: function() {
		this.readComponents();

        var self = this;
        this.components.recordSavings.date.datepicker({ dateFormat: 'yy-mm-dd' });
        this.components.importedCsvContent.bind('input propertychange', function() {
            self.importCsv();
        });

        $('#selectedAccount_Main').bootstrapToggle({ on: '', off: '' });
        $('#selectedAccount_Savings').bootstrapToggle({ on: '', off: '' });

        this.loadTags(this.loadTable);
	},

	readComponents: function() {
        this.components = {
            recordSavingsModal: $('#recordSavingModal'),
            recordSavings: {
                date: $('#savingsTransferredDate'),
                amount: $('#savingsAmount'),
                comment: $('#savingsComment')
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
                Cashflow.App.recordedExpensesPage.tags = data;
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

        Cashflow.App.recordedExpensesPage.expensesFromBank = new ExpenseParser().Parse(this.components.importedCsvContent.val(), logConfiguration);
    },

    storeExpenses: function() {

        var data = Cashflow.App.recordedExpensesPage.expensesFromBank;
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
        Cashflow.App.recordedExpensesPage.expensesFromBank = null;
        this.components.recordExpensesFromBankModal.modal();  
    },

    recordSavings: function() {

        var self = this;

        $.ajax({
            type: 'POST',
            url: '/api/recordSavings',
            data: JSON.stringify({ 
                savingsAmount: self.components.recordSavings.amount.val().replaceAll(' ', '').replaceAll('.', ''), 
                savingsDate: self.components.recordSavings.date.val(),
                savingsComment: self.components.recordSavings.comment.val()
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
            url: '/api/getExpenses?startDate=' + Cashflow.UI.DateRangePicker.vue.getStartDate() + '&endDate=' + Cashflow.UI.DateRangePicker.vue.getEndDate(),
            success: function(data) {

                Cashflow.App.recordedExpensesPage.recordedExpenses = data;
            },
            contentType: 'application/json; charset=utf-8'
        });
    }

}