var ExpensesPage = {

    components: null,

    htmlParts: [ 
        { target: 'expense-page', path: 'html_templates/expenses-page.html', append: false } 
    ],

    chartColors: [ '#FFD475', '#F7BA36', '#B77F05', '#FFB570', '#F99334', '#D66700', '#FFB093', '#FF723F', '#FF4300' ],

    loadedGraphs: {
        graph: false,
        pieChart: false,
        barChart: false
    },

    isVisible: function() {
        return Cashflow.App.navigation.currentPage == Navigation.ExpensesPage;
    },

    loadHtmlParts: function(initContext, next) {

        new HtmlPartsLoader(ExpensesPage.htmlParts).load(initContext, next);
    },

	initialize: function() {

        this.readComponents();
        this.refresh();
	},

    readComponents: function() {
        this.components = {
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
        debugger;
        this.loadedGraphs.graph = false;

		this.components.expenseGraph.yAxis.html('');
        this.components.expenseGraph.chart.html('');

        Cashflow.UI.DateRangePicker.vue.persistDateRangeState();

        if (!Cashflow.UI.DateRangePicker.vue.getStartDate()  || !Cashflow.UI.DateRangePicker.vue.getEndDate() || 
            Cashflow.UI.DateRangePicker.vue.getStartDate() == 'undefined' || Cashflow.UI.DateRangePicker.vue.getEndDate() == 'undefined') {
            console.log('Unable to load graph, start date or end date is not defined');
            return;
        }

        var self = this;

        Cashflow.Service.getAggregatedExpenses(
            Cashflow.UI.DateRangePicker.vue.getStartDate(), 
            Cashflow.UI.DateRangePicker.vue.getEndDate(), 
            function(rawData) {
                
                // Client side filtering
                var data = rawData;
                if (!self.components.filters.mainAccountFilter.is(':checked')) {
                    data[0].data = [];
                }

                if (!self.components.filters.savingsAccountFilter.is(':checked')) {
                    data[1].data = [];
                }

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

                ExpensesPage.loadedGraphs.graph = true;
                ExpensesPage.checkProgress();
            });
	},

    /********************************************************************************
      Expense Distribution PieChart
    ********************************************************************************/
    pieChart: null,

    loadPieChart: function() {

        this.loadedGraphs.pieChart = false;

        if (this.pieChart != null) {
            this.pieChart.destroy();
        }

        if (!Cashflow.UI.DateRangePicker.vue.getStartDate() || !Cashflow.UI.DateRangePicker.vue.getEndDate()) {
            console.log('Unable to load bar chart, start date or end date is not defined');
            return;
        }

        var self = this;

        Cashflow.Service.getAggregatedExpensesByTags(
            Cashflow.UI.DateRangePicker.vue.getStartDate(),
            Cashflow.UI.DateRangePicker.vue.getEndDate(),
            function(data) {
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

                ExpensesPage.loadedGraphs.pieChart = true;
                ExpensesPage.checkProgress();
            });
    },

    /********************************************************************************
      Expense Distribution BarChart
    ********************************************************************************/
    barChart: null,

    loadBarChart: function() {

        this.loadedGraphs.barChart = false;

        if (this.barChart != null) {
            this.barChart.destroy();
        }

        var self = this;

        Cashflow.Service.getAggregatedExpensesByTags(
            Cashflow.UI.DateRangePicker.vue.getStartDate(), 
            Cashflow.UI.DateRangePicker.vue.getEndDate(),
            function(data) {
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

                ExpensesPage.loadedGraphs.barChart = true;
                ExpensesPage.checkProgress();
            });
    },

    refresh: function() {

        if (this.isVisible()) {
            waitingDialog.show('Loading charts ...');
        }

        this.loadGraph();
        this.loadPieChart();
        this.loadBarChart();
        this.checkProgress();
    },

    checkProgress: function() {
        
        if (!this.isVisible()) {
            return;
        }

        var loadedCount = 0;
        loadedCount += ExpensesPage.loadedGraphs.graph ? 1 : 0;
        loadedCount += ExpensesPage.loadedGraphs.barChart ? 1 : 0;
        loadedCount += ExpensesPage.loadedGraphs.pieChart ? 1 : 0;
        var allLoaded = loadedCount == 3;

        console.log('Graph: ' + ExpensesPage.loadedGraphs.graph);
        console.log('Bar Chart: ' + ExpensesPage.loadedGraphs.barChart);
        console.log('Pie Chart: ' + ExpensesPage.loadedGraphs.pieChart);

        if (allLoaded) {
            waitingDialog.hide();
        }
        else {
            waitingDialog.message('Loading charts ... ('+loadedCount+'/3)');
        }
    },
}