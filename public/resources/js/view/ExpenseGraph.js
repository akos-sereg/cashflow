var cashflowChart = Ext.create('Ext.form.FormPanel', {
    title      : 'Graph',
    width      : 800,
    bodyPadding: 10,
    margins: '10 10 10 10',
    items: [{
        // Placeholder for Rickshaw Graph
        xtype: 'panel',
        html: '<div id="y_axis" style="position: absolute; top: 0; bottom: 0; width: 40px;"></div>'
            + '<div id="chart" style="position: relative; left: 40px; width: 635px; height: 350px;"></div>'
    }],
    load: function() {

        // Load expense list from server
        // ---------------------------------------------------------------------------------

        $.ajax({
            type: 'GET',
            url: '/api/getExpenses',
            //data: JSON.stringify(data),
            success: function(data) {

                // Render Graph
                // ---------------------------------------------------------------------------------
                var graph = new Rickshaw.Graph( {
                    element: document.getElementById('chart'),
                    renderer: 'line',
                    height: 350,
                    width: 800,
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

            },
            contentType: 'application/json; charset=utf-8'
        });


    }
});