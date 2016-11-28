module.exports = {

	load: function(sqlTemplate) {

		sqlTemplate.templates.push(
		    { name: 'GetExpenses', 
		      sql:  'SELECT expense.type, CAST(DATE(expense.expense_date) as CHAR) as expense_date, expense.transactionId, expense.expense_value, expense.location, '
		            + '  expense.comment, expense.expense_currency, expense.insert_date, expense.user_comment, expense.account_id, expense.modified_date, tag.label as tag '
		            + 'FROM cashflow.expense '
		            + '  LEFT JOIN cashflow.expense_tag ON (expense.transactionId = expense_tag.transactionId) '
		            + '  LEFT JOIN cashflow.tag ON (expense_tag.tag_id = tag.id) '
		            + 'WHERE expense_date BETWEEN ? AND ? '
		            + '  AND account_id = ? '
		            + 'ORDER BY expense_date ASC' 
		    });

		sqlTemplate.templates.push(
		    { name: 'FetchSavings', 
		      sql:  'SELECT expense.*,ceil(UNIX_TIMESTAMP(expense_date)/60/60/24) as DAYS_SINCE_EPOCH '
                    + 'FROM cashflow.expense WHERE expense_date BETWEEN ? AND ? AND account_id = ? ORDER BY expense_date ASC' 
		    });

		sqlTemplate.templates.push(
		    { name: 'FetchExpenses', 
		      sql:  'SELECT expense.*,ceil(UNIX_TIMESTAMP(expense_date)/60/60/24) as DAYS_SINCE_EPOCH '
                    + 'FROM cashflow.expense WHERE expense_date BETWEEN ? AND ? AND account_id = ? ORDER BY expense_date ASC' 
		    });

		sqlTemplate.templates.push(
		    { name: 'GetExpectedExpenses', 
		      sql:  'SELECT ee.id, eet.id as type_id, eet.name as type, ee.name, ee.amount, ee.effective_date, ee.paid '
		            + 'FROM cashflow.expected_expense ee '
		            + '  JOIN cashflow.expected_expense_type eet ON (eet.id = ee.expected_expense_type_id) '
		            + 'WHERE ee.effective_date > DATE_ADD(?, INTERVAL -3 MONTH) '
		            + '  AND ee.effective_date < DATE_ADD(?, INTERVAL 12 MONTH) ' 
		    });

		sqlTemplate.templates.push(
		    { name: 'GetTagAssociations', 
		      sql:  'SELECT tr.rule_id, tr.name, tr.pattern, tr.tag_id, t.label '
			         + ' FROM cashflow.tag_rule tr '
			         + ' JOIN cashflow.tag t ON (tr.tag_id = t.id) '
			         + ' ORDER BY name ASC' 
		    });

		sqlTemplate.templates.push(
		    { name: 'GetAggregatedExpensesByTags', 
		      sql:  'SELECT SUM(e.expense_value) amount, t.label '
		            + 'FROM cashflow.expense e '
		            + '  JOIN cashflow.expense_tag et ON (et.transactionId = e.transactionId) '
		            + '  JOIN cashflow.tag t ON (t.id = et.tag_id) '
		            + 'WHERE e.expense_date BETWEEN ? AND ? '
		            + '  AND account_id = ? '
		            + 'GROUP BY t.id '
		            + 'ORDER BY amount DESC' 
		    });
	}
}