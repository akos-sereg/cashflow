//var cashflowInput = Ext.create('Ext.form.FormPanel', {
Ext.define('Cashflow.view.expenses.input.CashflowInputText', {
    extend     : 'Ext.form.FormPanel',
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
            change: function(logEntry, newValue, oldValue, eOpts) {

                cashflowInputController.onInput(logEntry, newValue, oldValue, eOpts);
            }
        }
    }]
});
