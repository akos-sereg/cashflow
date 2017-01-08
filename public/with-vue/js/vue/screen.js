function Screen() {

}

Screen.prototype.create = function() {
	return new Vue({
	    el: '#app',
	    data: {
	      expensesPage: {

	      },
	      recordedExpensesPage: {
	        recordedExpenses:         null,
	        recordedExpensesFiltered: null,
	        expensesFromBank:         null, // import CSV from bank
	        tags:                     null, // user-defined tags
	      },
	      upcomingExpensesPage: {
	        upcomingExpenses:         null,
	        newUpcomingExpenseType:   null,
	        upcomingExpenseTypes:     null,
	        newUpcomingExpenseTypeId: null,
	        selectedUpcomingExpense:  {},
	      },
	      navigation: {
	      	currentPage: Navigation.ExpensesPage
	      }
	    },
	    methods: {
	      // Navigation
	      // --------------------------------------------------
	      changePage: function (newPage) {
	        	
	        	this.navigation.currentPage = newPage;
	        	
	      },

	      // Recorded Expenses page
	      // --------------------------------------------------
	      showRecordSavingsModal: function() {
	        RecordedExpensesPage.showRecordSavingsModal();
	      },

	      showRecordExpensesFromBank: function() {
	        RecordedExpensesPage.showRecordExpensesFromBank();
	      },

	      recordSavings: function() {
	        RecordedExpensesPage.recordSavings();
	      },

	      storeExpenses: function() {
	        RecordedExpensesPage.storeExpenses();
	      },

	      // Expected Expenses page
	      // --------------------------------------------------
	      upcomingExpensesMoveDateRange: function(days) {
	        ExpectedExpensesPage.currentDate = ExpectedExpensesPage.currentDate.addDays(days);
	        ExpectedExpensesPage.refresh();
	      },

	      showUpcomingExpenseModificationPopup: function(upcomingExpense) {
	        this.upcomingExpensesPage.selectedUpcomingExpense = upcomingExpense;
	        $('#modifyUpcomingExpense').modal();
	      },

	      setPaid: function(itemId, state) {
	        ExpectedExpensesPage.setPaid(itemId, state);
	      },

	      showAddUpcomingExpenseModal: function(type) {
	        ExpectedExpensesPage.showAddUpcomingExpenseModal(type);
	      },

	      saveUpcomingExpense: function() {
	        ExpectedExpensesPage.saveUpcomingExpense();
	      },

	      deleteUpcomingExpense: function(itemId) {
	        ExpectedExpensesPage.deleteUpcomingExpense(itemId); 
	      }

	    }
	  });
}