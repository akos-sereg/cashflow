var app = new Vue({
  el: '#app',
  data: {
    expenseGraphData: null,
    navigation: {
    	currentPage: Navigation.ExpensesPage
    }
  },
  methods: {
    changePage: function (newPage) {
      	
      	this.navigation.currentPage = newPage;
      	
    },

    loadGraph: function() {
    	ExpensesPage.loadGraph();
      ExpensesPage.loadPieChart();
      ExpensesPage.loadBarChart();
    }
  }
});

ExpensesPage.initialize();

