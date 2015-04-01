Ext.require('Ext.chart.*');
Ext.require(['Ext.Window', 'Ext.layout.container.Fit', 'Ext.fx.target.Sprite', 'Ext.window.MessageBox']);

document.compatMode = "CSS1Compat";

function generateData(n, floor){
    var data = [],
        p = (Math.random() *  11) + 1,
        i;

    floor = (!floor && floor !== 0)? 20 : floor;

    for (i = 0; i < (n || 12); i++) {
        data.push({
            name: Ext.Date.monthNames[i % 12],
            data1: Math.floor(Math.max((Math.random() * 100), floor)),
            data2: Math.floor(Math.max((Math.random() * 100), floor)),
            data3: Math.floor(Math.max((Math.random() * 100), floor)),
            data4: Math.floor(Math.max((Math.random() * 100), floor)),
            data5: Math.floor(Math.max((Math.random() * 100), floor)),
            data6: Math.floor(Math.max((Math.random() * 100), floor)),
            data7: Math.floor(Math.max((Math.random() * 100), floor)),
            data8: Math.floor(Math.max((Math.random() * 100), floor)),
            data9: Math.floor(Math.max((Math.random() * 100), floor))
        });
    }
    return data;
};

var barChartStore = Ext.create('Ext.data.JsonStore', {
    fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data9', 'data9'],
    data: generateData()
});

var barChart = Ext.create('Ext.chart.Chart', {
    style: 'background: #fff',
    animate: false,
    shadow: true,
    width: 1165,
    height: 200,
    store: barChartStore,
    axes: [{
        type: 'Numeric',
        position: 'left',
        fields: ['data1'],
        label: {
            renderer: Ext.util.Format.numberRenderer('0,0')
        },
        title: 'Number of Hits',
        grid: true,
        minimum: 0
    }, {
        type: 'Category',
        position: 'bottom',
        fields: ['name'],
        title: 'Month of the Year'
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
            this.setTitle(storeItem.get('name') + ': ' + storeItem.get('data1') + ' $');
          }
        },
        label: {
            display: 'insideEnd', 'text-anchor': 'middle',
            field: 'data1',
            renderer: Ext.util.Format.numberRenderer('0'),
            orientation: 'vertical',
            color: '#333'
        },
        xField: 'name',
        yField: 'data1'
    }]
});
