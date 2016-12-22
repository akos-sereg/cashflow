module.exports = {

	load: function(sqlTemplate) {

		sqlTemplate.templates.push(
		    { 
		    	name: 'GetExpenses', 

		      	mysql:  'SELECT expense.type, CAST(DATE(expense.expense_date) as CHAR) as expense_date, expense.transactionId, expense.expense_value, expense.location, '
		            + '  expense.comment, expense.expense_currency, expense.insert_date, expense.user_comment, expense.account_id, expense.modified_date, tag.label as tag '
		            + 'FROM cashflow.expense '
		            + '  LEFT JOIN cashflow.expense_tag ON (expense.transactionId = expense_tag.transactionId) '
		            + '  LEFT JOIN cashflow.tag ON (expense_tag.tag_id = tag.id) '
		            + 'WHERE expense_date BETWEEN ? AND ? '
		            + '  AND account_id = ? '
		            + 'ORDER BY expense_date ASC',

		      	sqlite: 'SELECT expense.type, expense.expense_date as expense_date, expense.transactionId, expense.expense_value, expense.location, '
		            + '  expense.comment, expense.expense_currency, expense.insert_date, expense.user_comment, expense.account_id, expense.modified_date, tag.label as tag '
		            + 'FROM cashflow.expense '
		            + '  LEFT JOIN cashflow.expense_tag ON (expense.transactionId = expense_tag.transactionId) '
		            + '  LEFT JOIN cashflow.tag ON (expense_tag.tag_id = tag.id) '
		            + 'WHERE expense_date BETWEEN ? AND ? '
		            + '  AND account_id = ? '
		            + 'ORDER BY expense_date ASC'
		    });

		sqlTemplate.templates.push(
		    { 
		    	name: 'FetchSavings', 
		      
		      	mysql:  'SELECT expense.*,ceil(UNIX_TIMESTAMP(expense_date)/60/60/24) as DAYS_SINCE_EPOCH '
                    + 'FROM cashflow.expense WHERE expense_date BETWEEN ? AND ? AND account_id = ? ORDER BY expense_date ASC',

                sqlite: 'SELECT expense.*,round(strftime("%s", expense_date)/60/60/24) as DAYS_SINCE_EPOCH '
                    + 'FROM cashflow.expense WHERE expense_date BETWEEN ? AND ? AND account_id = ? ORDER BY expense_date ASC',
		    });

		sqlTemplate.templates.push(
		    { 
		    	name: 'FetchExpenses', 
		      
		      	mysql:  'SELECT expense.*,ceil(UNIX_TIMESTAMP(expense_date)/60/60/24) as DAYS_SINCE_EPOCH '
                    + 'FROM cashflow.expense WHERE expense_date BETWEEN ? AND ? AND account_id = ? ORDER BY expense_date ASC',

                sqlite:  'SELECT expense.*,round(strftime("%s", expense_date)/60/60/24) as DAYS_SINCE_EPOCH '
                    + 'FROM cashflow.expense WHERE expense_date BETWEEN ? AND ? AND account_id = ? ORDER BY expense_date ASC' 
		    });

		sqlTemplate.templates.push(
		    { 
		    	name: 'GetExpectedExpenses', 
		      	mysql:  'SELECT ee.id, eet.id as type_id, eet.name as type, ee.name, ee.amount, ee.effective_date, ee.paid '
		            + 'FROM cashflow.expected_expense ee '
		            + '  JOIN cashflow.expected_expense_type eet ON (eet.id = ee.expected_expense_type_id) '
		            + 'WHERE ee.effective_date > DATE_ADD(?, INTERVAL -3 MONTH) '
		            + '  AND ee.effective_date < DATE_ADD(?, INTERVAL 12 MONTH) ',
		        sqlite:  'SELECT ee.id, eet.id as type_id, eet.name as type, ee.name, ee.amount, ee.effective_date, ee.paid '
		            + 'FROM cashflow.expected_expense ee '
		            + '  JOIN cashflow.expected_expense_type eet ON (eet.id = ee.expected_expense_type_id) '
		            + 'WHERE ee.effective_date > date(?, "-3 month") '
		            + '  AND ee.effective_date < date(?, "+1 month") ' 
		    });

		sqlTemplate.templates.push(
		    { 
		    	name: 'GetTagAssociations', 
		      	mysql:  'SELECT tr.rule_id, tr.name, tr.pattern, tr.tag_id, t.label '
			         + ' FROM cashflow.tag_rule tr '
			         + ' JOIN cashflow.tag t ON (tr.tag_id = t.id) '
			         + ' ORDER BY name ASC',
			    sqlite:  'SELECT tr.rule_id, tr.name, tr.pattern, tr.tag_id, t.label '
			         + ' FROM cashflow.tag_rule tr '
			         + ' JOIN cashflow.tag t ON (tr.tag_id = t.id) '
			         + ' ORDER BY name ASC' 
		    });

		sqlTemplate.templates.push(
		    { 
		    	name: 'GetAggregatedExpensesByTags', 
		      	mysql:  'SELECT SUM(e.expense_value) amount, t.label '
		            + 'FROM cashflow.expense e '
		            + '  JOIN cashflow.expense_tag et ON (et.transactionId = e.transactionId) '
		            + '  JOIN cashflow.tag t ON (t.id = et.tag_id) '
		            + 'WHERE e.expense_date BETWEEN ? AND ? '
		            + '  AND account_id = ? '
		            + 'GROUP BY t.id '
		            + 'ORDER BY amount DESC',
		        sqlite:  'SELECT SUM(e.expense_value) amount, t.label '
		            + 'FROM cashflow.expense e '
		            + '  JOIN cashflow.expense_tag et ON (et.transactionId = e.transactionId) '
		            + '  JOIN cashflow.tag t ON (t.id = et.tag_id) '
		            + 'WHERE e.expense_date BETWEEN ? AND ? '
		            + '  AND account_id = ? '
		            + 'GROUP BY t.id '
		            + 'ORDER BY amount DESC' 
		    });

		sqlTemplate.templates.push(
		    { 
		    	name: 'GetExpectedExpenseTypes', 
		      	mysql:  'SELECT expected_expense_type.id, expected_expense_type.name FROM cashflow.expected_expense_type ORDER BY name ASC',
		        sqlite:  'SELECT expected_expense_type.id, expected_expense_type.name FROM cashflow.expected_expense_type ORDER BY name ASC' 
		    });

		sqlTemplate.templates.push(
		    { 
		    	name: 'GetTags', 
		      	mysql:  'SELECT tag.id, tag.label FROM cashflow.tag ORDER BY label ASC',
		        sqlite:  'SELECT tag.id, tag.label FROM cashflow.tag ORDER BY label ASC' 
		    });

		sqlTemplate.templates.push(
		    { 
		    	name: 'GetTransaction', 
		      	mysql:  'SELECT transactionId FROM cashflow.expense WHERE transactionId = ?',
		        sqlite:  'SELECT transactionId FROM cashflow.expense WHERE transactionId = ?' 
		    });

		sqlTemplate.templates.push(
		    { 
		    	name: 'RecordSavings', 
		      	mysql:  'INSERT INTO cashflow.expense (type, expense_date, transactionId, expense_value, location, comment, '
	               + 'expense_currency, insert_date, user_comment, account_id, modified_date) '
	               + 'VALUES ("Atutalas", ?, CONCAT("manual", NOW()), ?, ?, null, "HUF", NOW(), null, ?, null) ',
		        sqlite:  'INSERT INTO cashflow.expense (type, expense_date, transactionId, expense_value, location, comment, '
	               + 'expense_currency, insert_date, user_comment, account_id, modified_date) '
	               + 'VALUES ("Atutalas", ?, CONCAT("manual", NOW()), ?, ?, null, "HUF", NOW(), null, ?, null) ' 
		    });
	}
}