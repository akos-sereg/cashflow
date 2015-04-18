Ext.define('Cashflow.controller.expenses.navigation.DateRangePickerController', {
    extend: 'Ext.app.Controller',

    onRangeChanged: function() {

        var dateRangePicker = Ext.getCmp('cashflow-date-picker');

        // "Persisted Data" tab
        Ext.getCmp('cashflow-expense-grid').controller.load(dateRangePicker.getStartDate(), dateRangePicker.getEndDate());

        // "Graphs" tab
        Ext.getCmp('cashflow-chart').controller.load(dateRangePicker.getStartDate(), dateRangePicker.getEndDate());
        Ext.getCmp('cashflow-bar-chart').controller.load(dateRangePicker.getStartDate(), dateRangePicker.getEndDate());
        Ext.getCmp('cashflow-pie-chart').controller.load(dateRangePicker.getStartDate(), dateRangePicker.getEndDate());
    }
});
