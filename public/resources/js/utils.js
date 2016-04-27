function formatAmount(amount) {
    var x = Math.ceil(amount);
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}

function epochDays(date) {
	return date / 1000 / 60 / 60 / 24;
}

function formatDate(date) {
	return $.datepicker.formatDate( "yy-mm-d", new Date(date));
}

Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

var expenseTypeIds = [ 1, 2, 3, 4, 5 ];