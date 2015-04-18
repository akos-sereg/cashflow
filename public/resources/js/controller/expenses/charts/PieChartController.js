Ext.define('Cashflow.controller.expenses.charts.PieChartController', {
    extend: 'Ext.app.Controller',

    load: function(startDate, endDate) {

        // Load aggregated expense list from server
        // ---------------------------------------------------------------------------------
        $.ajax({
            type: 'GET',
            url: '/api/getAggregatedExpensesByTags?startDate=' + startDate + '&endDate=' + endDate,
            success: function(data) {

                var sum = 0;
                for (var i=0; i!=data.length; i++) {
                    sum += Math.abs(data[i].amount);
                }

                for (var i=0; i!=data.length; i++) {
                    data[i].amount = (Math.abs(data[i].amount) * 100) / sum;
                }

                var displayedData = [];
                var othersIndex = -1;
                for (var i=0; i!=data.length; i++) {
                    if (data[i].amount > 5) {
                        displayedData.push(data[i]);
                    }
                    else {
                        if (othersIndex == -1) {
                            displayedData.push({ label: 'Others', amount: data[i].amount });
                            othersIndex = i;
                        }
                        else {
                            displayedData[othersIndex].amount += data[i].amount;
                        }
                    }
                }

                var pieChart = Ext.getCmp('cashflow-pie-chart');

                pieChart.series.removeAll(pieChart.series.items);
                pieChart.series.addAll([ pieChart.createSeries() ]);
                pieChart.store.loadData(displayedData);

            },
            contentType: 'application/json; charset=utf-8'
        });
    }
});
