function DateRangePicker(container, startDivId, endDivId) {
	this.container = container;
	this.startDivId = startDivId;
	this.endDivId = endDivId;
	this.vue = null;
}

DateRangePicker.prototype.create = function(onComplete) {

	var self = this;
	
	var htmlLoader = new HtmlPartsLoader([ 
		{ 
			target: self.container,
			path: 'html_templates/components/date-range-picker.html', 
			append: false 
		} 
	]).load(null, function() {

		self.vue = new Vue({
		    el: '#' + self.container,
		    data: { },
		    methods: { 
		    	getStartDate: function() {
		    		return $('#' + self.startDivId).val();
		    	},

		    	getEndDate: function() {
		    		return $('#' + self.endDivId).val();
		    	},

		    	refresh: function() {
			      	ExpensesPage.loadGraph();
			        ExpensesPage.loadPieChart();
			        ExpensesPage.loadBarChart();
			        RecordedExpensesPage.loadTable();
			    },

		    	persistDateRangeState: function() {
			        Utils.setCookie('cashflow_StartDate', this.getStartDate(), 365);
			    },

			    restoreDateRangeState: function() {
			        var startDate = Utils.getCookie('cashflow_StartDate');
			        var endDate = Utils.getCookie('cashflow_EndDate');

			        if (startDate) {
			            $('#' + self.startDivId).val(startDate);
			        }
			        else {
			            var dateOffset = (24*60*60*1000) * 30; // 30 days
			            var myDate = new Date();
			            myDate.setTime(myDate.getTime() - dateOffset);

			            $('#' + self.startDivId).datepicker("setDate", myDate);
			        }

			        $('#' + self.endDivId).datepicker("setDate", new Date());
			    },

		    }
		});

		$('#' + self.startDivId).datepicker({ dateFormat: 'yy-mm-dd' });
		$('#' + self.endDivId).datepicker({ dateFormat: 'yy-mm-dd' });

		self.vue.restoreDateRangeState();
		onComplete();
	});
    
}