function formatAmount(amount) {
    var x = Math.ceil(amount);
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}

function epochDays(date) {
	return date / 1000 / 60 / 60 / 24;
}