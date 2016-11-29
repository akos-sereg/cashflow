var ExpensesPage = {

	initialize: function() {
		$('#startDate').datepicker({ dateFormat: 'yy-mm-dd' });
		$('#endDate').datepicker({ dateFormat: 'yy-mm-dd' });
	},

	loadGraph: function() {

		$('#y_axis').html('');
        $('#chart').html('');
        
		$.ajax({
            type: 'GET',
            url: '/api/getAggregatedExpenses?startDate=' + $('#startDate').val() + '&endDate=' + $('#endDate').val(),
            success: function(data) {

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

            },
            contentType: 'application/json; charset=utf-8'
        });
	}
}