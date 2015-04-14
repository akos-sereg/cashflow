Ext.define('Cashflow.controller.expenses.navigation.DateRangePickerController', {
    extend: 'Ext.app.Controller',

    onRangeChanged: function() {
        // "Persisted Data" tab
        expenseDataGridController.load(dateRangePicker.getStartDate(), dateRangePicker.getEndDate());

        // "Graphs" tab
        cashflowChartController.load(dateRangePicker.getStartDate(), dateRangePicker.getEndDate());
        barChart.load(dateRangePicker.getStartDate(), dateRangePicker.getEndDate());
        pieChart.load(dateRangePicker.getStartDate(), dateRangePicker.getEndDate());
    }
});
