var store = Ext.create('Ext.data.JsonStore', {
    fields: ['label', 'amount'],
    data: []
});

var pieChart = Ext.create('Ext.chart.Chart', {
    width: 300,
    height: 250,
    animate: true,
    store: store,
    theme: 'Base:gradients',
    series: [{
        type: 'pie',
        angleField: 'amount',
        showInLegend: false,
        tips: {
            trackMouse: true,
            width: 140,
            height: 28,
            renderer: function (storeItem, item) {
                // calculate and display percentage on hover
                var total = 0;
                store.each(function (rec) {
                    total += rec.get('amount');
                });
                this.setTitle(storeItem.get('label') + ': ' + Math.round(storeItem.get('amount') / total * 100) + '%');
            }
        },
        highlight: {
            segment: {
                margin: 20
            }
        },
        label: {
            field: 'label',
            display: 'rotate',
            contrast: true,
            font: '12px Tahoma'
        },
        colorSet: ["#ECE093", "#EDA993", "#ED93B5", "#EB93ED", "#B193ED", "#93AEED" ],
    }],

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

                pieChart.store.loadData(data);
                pieChart.refresh();
            },
            contentType: 'application/json; charset=utf-8'
        });
    }
});