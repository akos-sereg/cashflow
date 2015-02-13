var cashflowInput = Ext.create('Ext.form.FormPanel', {
    title      : 'Paste your expense log here',
    width      : 800,
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
                var data = expenseParser.Parse(newValue);

                //cashflowGrid.reconfigure(data);
                cashflowGrid.store.loadData(data);
            }
        }
    }]
});