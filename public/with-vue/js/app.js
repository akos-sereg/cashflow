var app = new Vue({
  el: '#app',
  data: {
    expenseGraphData: null,
    recordedExpenses: null,
    expensesFromBank: null, // import CSV from bank
    tags: null, // user-defined tags
    upcomingExpenses: null,
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
    }

  }
});

ExpensesPage.initialize();
RecordedExpensesPage.initialize();
ExpectedExpensesPage.initialize();

