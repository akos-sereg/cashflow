var Utils = {
	formatAmount: function(amount) {
	    var x = Math.ceil(amount);
	    var parts = x.toString().split(".");
	    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	    return parts.join(".");
	},

	formatDate: function(date) {
		return $.datepicker.formatDate( "yy-mm-d", new Date(date));
	},

	setCookie: function(cname, cvalue, exdays) {
	    var d = new Date();
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    var expires = "expires="+ d.toUTCString();
	    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	},

	getCookie: function(cname) {
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i = 0; i <ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') {
	            c = c.substring(1);
	        }
	        if (c.indexOf(name) == 0) {
	            return c.substring(name.length,c.length);
	        }
	    }
	    return null;
	},

	getClassForAmount: function(amount) {

		if (amount < 0) {
			return 'cashflow-text-black';
		}
		else {
			return 'cashflow-text-green';
		}
	},

	getBackgroundClassForAmount: function(amount) {
		if (amount < 0) {
			return 'cashflow-text-white-bg';
		}
		else {
			return 'cashflow-text-green-bg';
		}
	},

	getTagKey: function(tag) {

		var tagId = null;
		app.tags.forEach(function(entry) {
			if (entry.label == tag) {
				tagId = entry.id;
			}
		});

		return tagId;
	},

	getClassForUpcomingExpenseItem: function(upcomingExpense) {
		if (upcomingExpense.paid) {
			return 'cashflow-upcoming-expense-item-green';
		}

		daysDiff = this.epochDays(Date.parse(upcomingExpense.effective_date)) - this.epochDays(new Date().getTime());
		console.log('Days diff between ' + this.epochDays(Date.parse(upcomingExpense.effective_date)) + ' and ' + new Date().getTime() + ' is ' + daysDiff);

		if (daysDiff > 10) {
			return 'cashflow-upcoming-expense-item-normal';
		}
		else if (daysDiff < 0) {
			return 'cashflow-upcoming-expense-item-red';
		}
		else {
			return 'cashflow-upcoming-expense-item-yellow';
		}
	},

	epochDays: function(date) {
		return date / 1000 / 60 / 60 / 24;
	}
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};