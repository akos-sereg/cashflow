var app = new Vue({
  el: '#app',
  data: {
    expenseGraphData: null,
    recordedExpenses: null,
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

  }
});

ExpensesPage.initialize();
RecordedExpensesPage.initialize();

