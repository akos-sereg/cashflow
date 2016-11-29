var ExpensesPage = {

	initialize: function() {
		$('#startDate').datepicker({ dateFormat: 'yy-mm-dd' });
		$('#endDate').datepicker({ dateFormat: 'yy-mm-dd' });
        
        this.restoreDateRangeState();
        this.loadGraph();
	},

	loadGraph: function() {

		$('#y_axis').html('');
        $('#chart').html('');

        this.persistDateRangeState();
        
		$.ajax({
            type: 'GET',
            url: '/api/getAggregatedExpenses?startDate=' + $('#startDate').val() + '&endDate=' + $('#endDate').val(),
            contentType: 'application/json; charset=utf-8',
            success: function(data) {

                app.expenseGraphData = data;

                // Clear Graph
                // ---------------------------------------------------------------------------------
                $('#y_axis').html('');
                $('#chart').html('');

                // Render Graph
                // ---------------------------------------------------------------------------------
                var graph = new Rickshaw.Graph( {
                    element: document.getElementById('chart'),
                    renderer: 'line',
                    height: 280,
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
                    tickFormat: function(y){ return Utils.formatAmount(y) }
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

            }
        });
	},

    persistDateRangeState: function() {
        Utils.setCookie('cashflow_StartDate', $('#startDate').val(), 365);
    },

    restoreDateRangeState: function() {
        var startDate = Utils.getCookie('cashflow_StartDate');
        var endDate = Utils.getCookie('cashflow_EndDate');

        if (startDate != null) {
            $('#startDate').val(startDate);
        }
        else {
            var dateOffset = (24*60*60*1000) * 30; // 30 days
            var myDate = new Date();
            myDate.setTime(myDate.getTime() - dateOffset);
            $('#startDate').datepicker("setDate", myDate);
        }

        $('#endDate').datepicker("setDate", new Date());
    }
}