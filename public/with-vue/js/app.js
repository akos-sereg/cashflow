var app = new Vue({
  el: '#app',
  data: {
    navigation: {
    	currentPage: Navigation.ExpensesPage
    }
  },
  methods: {
    changePage: function (newPage) {
      	this.navigation.currentPage = newPage;
    }
  }
});