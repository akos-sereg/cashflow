function CashflowService() {

}

// eg. getAggregatedExpenses('2016-01-01', '2016-12-31', function)
CashflowService.prototype.getAggregatedExpenses = function(startDate, endDate, onSuccess) {

	$.ajax({
        type: CashflowServiceApi.getAggregatedExpenses.method,
        url: CashflowServiceApi.getAggregatedExpenses.url.replace('{startDate}', startDate).replace('{endDate}', endDate),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
        	onSuccess(data);
        }
    });

}

// eg. getAggregatedExpenses('2016-01-01', '2016-12-31', function)
CashflowService.prototype.getAggregatedExpensesByTags = function(startDate, endDate, onSuccess) {
	$.ajax({
        type: CashflowServiceApi.getAggregatedExpenses.method,
        url: CashflowServiceApi.getAggregatedExpensesByTags.url.replace('{startDate}', startDate).replace('{endDate}', endDate),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
        	onSuccess(data);
        }
	});       

}

// eg. setTag({ tagLabel: 'Car', transactionId: '123abc'})
CashflowService.prototype.setTag = function(tagDetails, onSuccess) {

	$.ajax({
        type: CashflowServiceApi.setTag.method,
        url: CashflowServiceApi.setTag.url,
        data: tagDetails,
        contentType: 'application/x-www-form-urlencoded',
        success: function(data) {

        	onSuccess(data);
            
        },
    });
}

CashflowService.prototype.loadTags = function(onSuccess) {
	$.ajax({
        type: CashflowServiceApi.loadTags.method,
        url: CashflowServiceApi.loadTags.url,
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            onSuccess(data);
        },
    });
}

CashflowService.prototype.storeExpenses = function(importedData, onSuccess) {
	$.ajax({
        type: CashflowServiceApi.storeExpenses.method,
        url: CashflowServiceApi.storeExpenses.url,
        data: JSON.stringify(importedData),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            onSuccess(data);
        },
    });
}


CashflowService.prototype.recordSavings = function(savingsData, onSuccess) {
	$.ajax({
        type: CashflowServiceApi.recordSavings.method,
        url: CashflowServiceApi.recordSavings.url,
        data: JSON.stringify(savingsData),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            onSuccess(data);
        },
    });
}

CashflowService.prototype.getExpenses = function(startDate, endDate, onSuccess) {
	$.ajax({
        type: CashflowServiceApi.getExpenses.method,
        url: CashflowServiceApi.getExpenses.url.replace('{startDate}', startDate).replace('{endDate}', endDate),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            onSuccess(data);
        },
    });
}

CashflowService.prototype.deleteUpcomingExpense = function(itemId, onSuccess) {

	$.ajax({
        type: CashflowServiceApi.deleteUpcomingExpense.method,
        url: CashflowServiceApi.deleteUpcomingExpense.url,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ id: itemId }),
        success: function(rawData) {
            onSuccess();
        }
    });

}

CashflowService.prototype.createUpcomingExpense = function(upcomingExpenseDetails, onSuccess) {

	$.ajax({
        type: CashflowServiceApi.createUpcomingExpense.method,
        url: CashflowServiceApi.createUpcomingExpense.url,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(upcomingExpenseDetails),
        success: function(rawData) {
			onSuccess();
        }
    });

}

CashflowService.prototype.setUpcomingExpenseStatus = function(itemId, state, onSuccess) {

	$.ajax({
        type: CashflowServiceApi.setUpcomingExpenseStatus.method,
        url: CashflowServiceApi.setUpcomingExpenseStatus.url,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({itemId: itemId, status: state}),
        success: function(rawData) {
           onSuccess();
        }
    });

}

CashflowService.prototype.getUpcomingExpenses = function(startDate, onSuccess) {
	$.ajax({
        type: CashflowServiceApi.getUpcomingExpenses.method,
        url: CashflowServiceApi.getUpcomingExpenses.url.replace('{startDate}', startDate),
        contentType: 'application/json; charset=utf-8',
        success: function(rawData) {
            onSuccess(rawData);
        }
    });
}