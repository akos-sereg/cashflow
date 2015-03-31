Ext.require([
    'Ext.util.*',
]);

var cashflowChart = Ext.create('Ext.form.FormPanel', {
    //title      : 'Graph',
    border     : false,
    width      : 1165,
    bodyPadding: 10,
    margins: '0 0 0 0',
    items: [{
        // Placeholder for Rickshaw Graph
        xtype: 'panel',
        html: '<div id="y_axis" style="position: absolute; top: 0; bottom: 0; width: 40px;"></div>'
            + '<div id="chart" style="position: relative; left: 40px; width: 635px; height: 350px;"></div>'
    }],
    clear: function() {
        $('#y_axis').html('');
        $('#chart').html('');
    },
    load: function(startDate, endDate) {

        this.clear();

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
                    height: 350,
                    width: 1165,
                    min: 'auto',
                    interpolation: 'linear',
                    series: [{
                            data: data[0].data,
                            color: "#c05020"
                    }]
                } );

                var y_ticks = new Rickshaw.Graph.Axis.Y( {
                    graph: graph,
                    tickFormat: function(y){return y}
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

                //cashflowChart.setTitle('Graph (' + data[0].data.length + ' records)');

            },
            contentType: 'application/json; charset=utf-8'
        });


    }
});