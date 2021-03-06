Ext.define('Cashflow.controller.expenses.charts.ExpenseGraphController', {
    extend: 'Ext.app.Controller',

    load: function(startDate, endDate) {

        var cashflowChart = Ext.getCmp('cashflow-chart');

        cashflowChart.clear();

        // Load expense list from server
        // ---------------------------------------------------------------------------------

        $.ajax({
            type: 'GET',
            url: '/api/getAggregatedExpenses?startDate=' + startDate + '&endDate=' + endDate,
            success: function(data) {

                // Render Graph
                // ---------------------------------------------------------------------------------
                var graph = new Rickshaw.Graph( {
                    element: document.getElementById('chart'),
                    renderer: 'line',
                    height: cashflowChart.getPreferredHeight(),
                    width: 1150,
                    min: 'auto',
                    interpolation: 'linear',
                    series: [{
                            data: data[0].data,
                            color: data[0].color
                    },
                    {
                            data: data[1].data,
                            color: data[1].color
                    }]
                } );

                var x_axis = new Rickshaw.Graph.Axis.Time( { graph: graph } );  

                var y_ticks = new Rickshaw.Graph.Axis.Y( {
                    graph: graph,
                    tickFormat: function(y){ return formatAmount(y) }
                } );

                graph.render();

                var detail = new Rickshaw.Graph.HoverDetail({ graph: graph,
                formatter: function(series, x, y) {
                    var title = '';
                    for (var i=0; i!=series.data.length; i++) {
                        if (series.data[i].x == x) {
                            title = series.data[i].title;
                        }
                    }

                    return title;
                } });

            },
            contentType: 'application/json; charset=utf-8'
        });
    }

});
