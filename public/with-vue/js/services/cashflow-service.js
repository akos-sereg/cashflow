function CashflowService() {

}

// eg. getAggregatedExpenses('2016-01-01', '2016-12-31', function)
CashflowService.prototype.getAggregatedExpenses = function(startDate, endDate, onSuccess) {

	$.ajax({
        type: 'GET',
        url: '/api/getAggregatedExpenses?startDate=' + startDate + '&endDate=' + endDate,
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
        	onSuccess(data);
        }
    });

}

// eg. getAggregatedExpenses('2016-01-01', '2016-12-31', function)
CashflowService.prototype.getAggregatedExpensesByTags = function(startDate, endDate, onSuccess) {
	$.ajax({
        type: 'GET',
        url: '/api/getAggregatedExpensesByTags?startDate=' + Cashflow.UI.DateRangePicker.vue.getStartDate() + '&endDate=' + Cashflow.UI.DateRangePicker.vue.getEndDate(),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
        	onSuccess(data);
        }
	});       

}

// eg. setTag({ tagLabel: 'Car', transactionId: '123abc'})
CashflowService.prototype.setTag = function(tagDetails, onSuccess) {

	$.ajax({
        type: 'POST',
        url: '/api/setTag',
        data: tagDetails,
        contentType: 'application/x-www-form-urlencoded',
        success: function(data) {

        	onSuccess(data);
            
        },
    });
}

CashflowService.prototype.loadTags = function(onSuccess) {
	$.ajax({
        type: 'GET',
        url: '/api/getTags',
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            onSuccess(data);
        },
    });
}

CashflowService.prototype.storeExpenses = function(importedData, onSuccess) {
	$.ajax({
        type: 'POST',
        url: '/api/storeExpenses',
        data: JSON.stringify(importedData),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            onSuccess(data);
        },
    });
}


CashflowService.prototype.recordSavings = function(savingsData, onSuccess) {
	$.ajax({
        type: 'POST',
        url: '/api/recordSavings',
        data: JSON.stringify(savingsData),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            onSuccess(data);
        },
    });
}

CashflowService.prototype.getExpenses = function(startDate, endDate, onSuccess) {
	$.ajax({
        type: 'GET',
        url: '/api/getExpenses?startDate=' + startDate + '&endDate=' + endDate,
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            onSuccess(data);
        },
    });
}

CashflowService.prototype.deleteUpcomingExpense = function(itemId, onSuccess) {

	$.ajax({
        type: 'POST',
        url: '/api/deleteExpectedExpense',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ id: itemId }),
        success: function(rawData) {
            onSuccess();
        }
    });

}

CashflowService.prototype.createUpcomingExpense = function(upcomingExpenseDetails, onSuccess) {

	$.ajax({
        type: 'POST',
        url: '/api/createExpectedExpense',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(upcomingExpenseDetails),
        success: function(rawData) {
			onSuccess();
        }
    });

}

CashflowService.prototype.setUpcomingExpenseStatus = function(itemId, state, onSuccess) {

	$.ajax({
        type: 'POST',
        url: '/api/setExpectedExpenseStatus',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({itemId: itemId, status: state}),
        success: function(rawData) {
           onSuccess();
        }
    });

}

CashflowService.prototype.getUpcomingExpenses = function(startDate, onSuccess) {
	$.ajax({
        type: 'GET',
        url: '/api/getExpectedExpenses?date=' + startDate,
        contentType: 'application/json; charset=utf-8',
        success: function(rawData) {
            onSuccess(rawData);
        }
    });
}