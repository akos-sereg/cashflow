Ext.require('Ext.chart.*');
Ext.require(['Ext.Window', 'Ext.layout.container.Fit', 'Ext.fx.target.Sprite', 'Ext.window.MessageBox']);

var barChartStore = Ext.create('Ext.data.JsonStore', {
    fields: ['label', 'amount'],
    data: []
});

var barChart = Ext.create('Ext.chart.Chart', {
    style: 'background: #fff',
    animate: false,
    shadow: true,
    width: 1165,
    height: 280,
    store: barChartStore,
    axes: [{
        type: 'Numeric',
        position: 'left',
        fields: ['amount'],
        label: {
            renderer: Ext.util.Format.numberRenderer('0,0')
        },
        title: 'Amount spent',
        grid: true,
        minimum: 'auto'
    }, {
        type: 'Category',
        position: 'bottom',
        fields: ['label'],
        //title: 'Expense category'
    }],
    series: [{
        type: 'column',
        axis: 'left',
        highlight: false,
        renderer: function(sprite, record, attr, index, store){
           return Ext.apply(attr, {
              fill: '#DDB880'
           });
        },
        tips: {
          trackMouse: true,
          width: 140,
          height: 28,
          renderer: function(storeItem, item) {
            this.setTitle(storeItem.get('label') + ': ' + storeItem.get('amount'));
          }
        },
        label: {
            display: 'insideEnd', 'text-anchor': 'middle',
            field: 'amount',
            renderer: Ext.util.Format.numberRenderer('0'),
            orientation: 'vertical',
            color: '#333'
        },
        xField: 'label',
        yField: 'amount'
    }],

    load: function(startDate, endDate) {

        // Load aggregated expense list from server
        // ---------------------------------------------------------------------------------
        $.ajax({
            type: 'GET',
            url: '/api/getAggregatedExpensesByTags?startDate=' + startDate + '&endDate=' + endDate,
            success: function(data) {
                barChart.store.loadData(data);
            },
            contentType: 'application/json; charset=utf-8'
        });


    }


});
