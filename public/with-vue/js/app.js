function initVue() {
  var app = new Vue({
    el: '#app',
    data: {
      expenseGraphData: null,
      recordedExpenses: null,
      expensesFromBank: null, // import CSV from bank
      tags: null, // user-defined tags
      upcomingExpenses: null,
      newUpcomingExpenseType: null,
      upcomingExpenseTypes: null,
      newUpcomingExpenseTypeId: null,
      selectedUpcomingExpense: {},
      navigation: {
      	currentPage: Navigation.ExpensesPage
      }
    },
    methods: {
      changePage: function (newPage) {
        	
        	this.navigation.currentPage = newPage;
        	
      },

      refresh: function() {
      	ExpensesPage.loadGraph();
        ExpensesPage.loadPieChart();
        ExpensesPage.loadBarChart();

        RecordedExpensesPage.loadTable();
      },

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

      upcomingExpensesMoveDateRange: function(days) {
        ExpectedExpensesPage.currentDate = ExpectedExpensesPage.currentDate.addDays(days);
        ExpectedExpensesPage.refresh();
      },

      showUpcomingExpenseModificationPopup: function(upcomingExpense) {
        this.selectedUpcomingExpense = upcomingExpense;
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

  window.app = app;
}

var initChain = new InitChain();
initChain.add(ExpensesPage.loadHtmlParts);
initChain.add(RecordedExpensesPage.loadHtmlParts);
initChain.add(ExpectedExpensesPage.loadHtmlParts);
initChain.run(function() {

  initVue();

  ExpensesPage.initialize();
  RecordedExpensesPage.initialize();
  ExpectedExpensesPage.initialize();
});



