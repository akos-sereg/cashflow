var cashflowInput = Ext.create('Ext.form.FormPanel', {
    title      : 'Paste your expense log here',
    width      : 1165,
    bodyPadding: 10,
    margins: '10 10 10 10',
    items: [{
        xtype     : 'textareafield',
        grow      : false,
        name      : 'message',
        fieldLabel: 'CSV Content',
        anchor    : '100%',
        listeners : {
            change: function(logEntry, newValue, oldValue, eOpts ) {

                var expenseParser = new ExpenseParser();
                cashflowGrid.store.loadData(expenseParser.Parse(newValue));
            }
        }
    }]
});