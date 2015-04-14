var pieChartStore = Ext.create('Ext.data.JsonStore', {
    fields: ['label', 'amount'],
    data: []
});

function getSeries() {
    return {
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
                pieChartStore.each(function (rec) {
                    total += rec.get('amount');
                });
                this.setTitle(storeItem.get('label') + ': ' + Math.round(storeItem.get('amount') / total * 100) + '%');
            }
        },
        highlight: {
            segment: {
                margin: 2
            }
        },
        label: {
            visible: false,
            field: 'label',
            display: 'rotate',
            contrast: true,
            font: '10px Tahoma'
        },
        colorSet: ["#ECE1AF", "#C6B775", "#EDD468", "#EDDB8B", "#FFEB96" ],
    };
}

Ext.define('Cashflow.view.expenses.charts.PieChart', {
    extend: 'Ext.chart.Chart',
    width: 300,
    height: 250,
    animate: false,
    store: pieChartStore,
    theme: 'Base:gradients',
    series: [ getSeries() ],
    createSeries: getSeries
});
