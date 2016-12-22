var Cashflow = {};
Cashflow.UI = {};  
Cashflow.Service = new CashflowService();
//Cashflow.Service = new CashflowServiceMock();

var initChain = new InitChain();
initChain.add(ExpensesPage.loadHtmlParts);
initChain.add(RecordedExpensesPage.loadHtmlParts);
initChain.add(ExpectedExpensesPage.loadHtmlParts);
initChain.run(function() {

  Cashflow.App = new Screen().create();
  Cashflow.UI.DateRangePicker = new DateRangePicker('cashflow-date-range-picker', 'startDate', 'endDate');
  Cashflow.UI.DateRangePicker.create(function() {
      window.Cashflow = Cashflow;

      ExpensesPage.initialize();
      RecordedExpensesPage.initialize();
      ExpectedExpensesPage.initialize();
  });


});



