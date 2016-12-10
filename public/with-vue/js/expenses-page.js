var ExpensesPage = {

    components: null,

    htmlParts: [ ],

    chartColors: [ '#FFD475', '#F7BA36', '#B77F05', '#FFB570', '#F99334', '#D66700', '#FFB093', '#FF723F', '#FF4300' ],

    loadHtmlParts: function(initContext, next) {
        console.log('Load HTML Parts stage I');
        next(initContext);
    },

	initialize: function() {

        this.readComponents();

		this.components.dateRangeSelector.startDate.datepicker({ dateFormat: 'yy-mm-dd' });
		this.components.dateRangeSelector.endDate.datepicker({ dateFormat: 'yy-mm-dd' });
        
        this.restoreDateRangeState();
        
        this.loadGraph();
        this.loadPieChart();
        this.loadBarChart();
	},

    readComponents: function() {
        this.components = {
            dateRangeSelector: {
                startDate: $('#startDate'),
                endDate: $('#endDate'),
            },
            expenseGraph: {
                yAxis: $('#y_axis'),
                chart: $('#chart')
            },
            pieChart: $('#expenseDistributionPieChart'),
            barChart: $('#expenseDistributionBarChart'),
            filters: {
                mainAccountFilter: $('#selectedAccount_Main'),
                savingsAccountFilter: $('#selectedAccount_Savings')
            }
        };
    },

    /********************************************************************************
      Expense Burndown Graph
    ********************************************************************************/
	loadGraph: function() {

		this.components.expenseGraph.yAxis.html('');
        this.components.expenseGraph.chart.html('');

        this.persistDateRangeState();

        if (!this.components.dateRangeSelector.startDate.val() || !this.components.dateRangeSelector.endDate.val() || 
            this.components.dateRangeSelector.startDate.val() == 'undefined' || this.components.dateRangeSelector.endDate.val() == 'undefined') {
            console.log('Unable to load graph, start date or end date is not defined');
            return;
        }

        var self = this;
        
		$.ajax({
            type: 'GET',
            url: '/api/getAggregatedExpenses?startDate=' + self.components.dateRangeSelector.startDate.val() + '&endDate=' + self.components.dateRangeSelector.endDate.val(),
            contentType: 'application/json; charset=utf-8',
            success: function(rawData) {

                // Filtering
                var data = rawData;
                if (!self.components.filters.mainAccountFilter.is(':checked')) {
                    data[0].data = [];
                }

                if (!self.components.filters.savingsAccountFilter.is(':checked')) {
                    data[1].data = [];
                }

                app.expenseGraphData = data;

                // Clear Graph
                // ---------------------------------------------------------------------------------
                self.components.expenseGraph.yAxis.html('');
                self.components.expenseGraph.chart.html('');

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
                            // Expenses
                            data: data[0].data,
                            color: data[0].color
                    },
                    {
                            // Savings
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
        Utils.setCookie('cashflow_StartDate', this.components.dateRangeSelector.startDate.val(), 365);
    },

    restoreDateRangeState: function() {
        var startDate = Utils.getCookie('cashflow_StartDate');
        var endDate = Utils.getCookie('cashflow_EndDate');

        if (startDate != null) {
            this.components.dateRangeSelector.startDate.val(startDate);
        }
        else {
            var dateOffset = (24*60*60*1000) * 30; // 30 days
            var myDate = new Date();
            myDate.setTime(myDate.getTime() - dateOffset);

            this.components.dateRangeSelector.startDate.datepicker("setDate", myDate);
        }

        this.components.dateRangeSelector.endDate.datepicker("setDate", new Date());
    },

    /********************************************************************************
      Expense Distribution PieChart
    ********************************************************************************/
    pieChart: null,

    loadPieChart: function() {

        if (this.pieChart != null) {
            this.pieChart.destroy();
        }

        if (!this.components.dateRangeSelector.startDate.val() || !this.components.dateRangeSelector.endDate.val()) {
            console.log('Unable to load bar chart, start date or end date is not defined');
            return;
        }

        var self = this;

        $.ajax({
            type: 'GET',
            url: '/api/getAggregatedExpensesByTags?startDate=' + this.components.dateRangeSelector.startDate.val() + '&endDate=' + this.components.dateRangeSelector.endDate.val(),
            contentType: 'application/json; charset=utf-8',
            success: function(data) {

                // Aggregate
                var sum = 0;
                for (var i=0; i!=data.length; i++) {
                    sum += Math.abs(data[i].amount);
                }

                for (var i=0; i!=data.length; i++) {
                    data[i].amount = (Math.abs(data[i].amount) * 100) / sum;
                }

                var displayedData = [];
                var othersIndex = -1;
                for (var i=0; i!=data.length; i++) {
                    if (data[i].amount > 5) {
                        displayedData.push(data[i]);
                    }
                    else {
                        if (othersIndex == -1) {
                            displayedData.push({ label: 'Others', amount: data[i].amount });
                            othersIndex = i;
                        }
                        else {
                            displayedData[othersIndex].amount += data[i].amount;
                        }
                    }
                }

                var pieLabels = [];
                var pieData = [];
                var pieColors = [];

                var index = 0;
                displayedData.forEach(function(item) {
                    pieLabels.push(item.label);
                    pieData.push(Utils.formatAmount(item.amount));
                    pieColors.push(self.chartColors[index % self.chartColors.length]);
                    index++;
                });

                // Populate PieChart
                self.pieChart = new Chart(self.components.pieChart, {
                    type: 'pie',
                    data: {
                        labels: pieLabels,
                        datasets: [
                            {
                                data: pieData,
                                backgroundColor: pieColors,
                                hoverBackgroundColor: pieColors
                            }]
                    },
                    options: null
                });
            }
        });
    },

    /********************************************************************************
      Expense Distribution BarChart
    ********************************************************************************/
    barChart: null,

    loadBarChart: function() {

        if (this.barChart != null) {
            this.barChart.destroy();
        }

        var self = this;

        $.ajax({
            type: 'GET',
            url: '/api/getAggregatedExpensesByTags?startDate=' + this.components.dateRangeSelector.startDate.val() + '&endDate=' + this.components.dateRangeSelector.endDate.val(),
            contentType: 'application/json; charset=utf-8',
            success: function(data) {

                var pieData = [];
                var pieColors = [];
                var pieLabels = [];
                var index = 0;
                data.forEach(function(item) {
                    pieLabels.push(item.label);
                    pieData.push(item.amount);
                    pieColors.push(self.chartColors[index % self.chartColors.length]);
                    index++;
                });

                self.barChart = new Chart(self.components.barChart, {
                    type: 'bar',
                    data: {
                        labels: pieLabels,
                        datasets: [
                            {
                                label: 'amount spent',
                                borderWidth: 1,
                                data: pieData,
                                borderColor: pieColors,
                                backgroundColor: pieColors
                            }]
                    },
                    options: null
                });
            }
        });
    }
}