var CashflowServiceApi = {

	getAggregatedExpenses: 
	{ 
		url: '/api/getAggregatedExpenses?startDate={startDate}&endDate={endDate}', 
		method: 'GET' 
	},

	getAggregatedExpensesByTags: { 
		url: '/api/getAggregatedExpensesByTags?startDate={startDate}&endDate={endDate}', 
		method: 'GET' 
	},

	setTag: { 
		url: '/api/setTag', 
		method: 'POST' 
	},

	loadTags: { 
		url: '/api/getTags', 
		method: 'GET' 
	},

	storeExpenses: { 
		url: '/api/storeExpenses', 
		method: 'POST' 
	},

	recordSavings: { 
		url: '/api/recordSavings', 
		method: 'POST' 
	},

	getExpenses: { 
		url: '/api/getExpenses?startDate={startDate}&endDate={endDate}', 
		method: 'GET' 
	},

	deleteUpcomingExpense: { 
		url: '/api/deleteExpectedExpense', 
		method: 'POST' 
	},

	createUpcomingExpense: { 
		url: '/api/createExpectedExpense', 
		method: 'POST' 
	},

	setUpcomingExpenseStatus: { 
		url: '/api/setExpectedExpenseStatus', 
		method: 'POST' 
	},

	getUpcomingExpenses: { 
		url: '/api/getExpectedExpenses?date={startDate}', 
		method: 'GET' 
	}
}