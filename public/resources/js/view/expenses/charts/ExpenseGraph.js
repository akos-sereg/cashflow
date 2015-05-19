Ext.require([
    'Ext.util.*',
]);

Ext.define('Cashflow.view.expenses.charts.ExpenseGraph', {
    extend: 'Ext.form.FormPanel',
    border     : false,
    width      : 1200,
    bodyPadding: 0,
    margins: '0 0 0 0',
    items: [{
        // Placeholder for Rickshaw Graph
        xtype: 'panel',
        html: '<div id="y_axis" style="position: absolute; top: 0; bottom: 0; width: 40px;"></div>'
            + '<div id="chart" style="position: relative; left: 40px; width: 635px; height: '+(220 /* preferred height */ + 80)+'px;"></div>'
    }],

    clear: function() {
        $('#y_axis').html('');
        $('#chart').html('');
    },

    getPreferredHeight: function() {
        return 220;
    },

    constructor: function(config) {
        this.callParent(arguments);
        this.controller = Ext.create('Cashflow.controller.expenses.charts.ExpenseGraphController');
    }
});