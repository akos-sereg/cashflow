var ExpectedExpensesPage = {

	components: {
		modifyUpcomingExpenseModal: null,
		addUpcomingExpenseModal: null,
		newUpcomingExpense: {
			name: null,
			date: null,
			amount: null
		}
	},

    htmlParts: [ 
        { target: 'upcoming-page', path: 'html_templates/upcoming-expenses-page.html', append: false },
        { target: 'modal-container', path: 'html_templates/dialog/add-upcoming-expense-modal.html', append: true }, 
        { target: 'modal-container', path: 'html_templates/dialog/modify-upcoming-expense-modal.html', append: true }
    ],

	// Hardcoded values of expected expense types
	expenseTypes: [ 
		{ id: 1, name: 'Cell Phone' }, 
		{ id: 2, name: 'Flat' }, 
		{ id: 3, name: 'Car' },
		{ id: 4, name: 'RSU Tax' },
		{ id: 5, name: 'Savings' }
	],

    loadHtmlParts: function(initContext, next) {

        new HtmlPartsLoader(ExpectedExpensesPage.htmlParts).load(initContext, next);
    },

	currentDate: new Date(),

	initialize: function() {

		Cashflow.App.upcomingExpensesPage.upcomingExpenseTypes = this.expenseTypes;

		this.readComponents();

		this.components.newUpcomingExpense.date.datepicker({ dateFormat: 'yy-mm-dd' });

		this.refresh();

	},

	readComponents: function() {
		this.components.modifyUpcomingExpenseModal = $('#modifyUpcomingExpense');
		this.components.addUpcomingExpenseModal = $('#addUpcomingExpenseModal');
		this.components.newUpcomingExpense.name = $('#upcomingExpenseName');
		this.components.newUpcomingExpense.date = $('#upcomingExpenseDate');
		this.components.newUpcomingExpense.amount = $('#upcomingExpenseAmount');
	},

	deleteUpcomingExpense: function(itemId) {

		var self = this;

		Cashflow.Service.deleteUpcomingExpense(itemId, function() {
            self.refresh();
            self.components.modifyUpcomingExpenseModal.modal('hide');
        });
	},

	saveUpcomingExpense: function() {

		var self = this;
		
        Cashflow.Service.createUpcomingExpense({
                name: self.components.newUpcomingExpense.name.val(),
                typeId: Cashflow.App.upcomingExpensesPage.newUpcomingExpenseTypeId,
                effectiveDate: this.components.newUpcomingExpense.date.val(),
                amount: this.components.newUpcomingExpense.amount.val()
            }, function() {
                self.refresh();
                self.components.addUpcomingExpenseModal.modal('hide');
            });
	},

	setPaid: function(itemId, state) {

		var self = this;
		
        Cashflow.Service.setUpcomingExpenseStatus(itemId, state, function() {
            self.refresh();
            self.components.modifyUpcomingExpenseModal.modal('hide');
        });
	},

	showAddUpcomingExpenseModal: function(typeId) {
		Cashflow.App.upcomingExpensesPage.newUpcomingExpenseType = this.findUpcomingExpenseTypeName(typeId);
		Cashflow.App.upcomingExpensesPage.newUpcomingExpenseTypeId = typeId;
		this.components.addUpcomingExpenseModal.modal();
	},

	findUpcomingExpenseTypeName: function(typeId) {

		var name = null;
		this.expenseTypes.forEach(function(type) {
			if (type.id == typeId) {
				name = type.name;
			}
		});

		return name;
	},

	refresh: function() {

		var self = this;
        
        Cashflow.Service.getUpcomingExpenses(Utils.formatDate(self.currentDate), function(rawData) {
            Cashflow.App.upcomingExpensesPage.upcomingExpenses = self.getMonthlyExpectedExpenses(rawData);
                
            setTimeout(function(){ 
                $('[data-toggle="tooltip"]').tooltip();
            }, 300);
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

            for (var j=0; j!=this.expenseTypes.length; j++) {
                row['expected_id_' + this.expenseTypes[j].id] = [];
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
            for (var j=0; j!=this.expenseTypes.length; j++) {
                data[i].total += this.getTotalForCell(data[i]['expected_id_' + this.expenseTypes[j].id]);
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