Ext.define('Cashflow.controller.expenses.charts.BarChartController', {
    extend: 'Ext.app.Controller',

    load: function(startDate, endDate) {

        // Load aggregated expense list from server
        // ---------------------------------------------------------------------------------
        $.ajax({
            type: 'GET',
            url: '/api/getAggregatedExpensesByTags?startDate=' + startDate + '&endDate=' + endDate,
            success: function(data) {
                Ext.getCmp('cashflow-bar-chart').store.loadData(data);
            },
            contentType: 'application/json; charset=utf-8'
        });
    }
});
