var dateRangePicker = Ext.create('Ext.form.FormPanel', {
    bodyPadding: 10,
    margins: '0 0 5 0',
    //title: 'Dates',
    border: false,
    //collapsible: true,
    items: [{
        xtype: 'datefield',
        id: 'startDateControl',
        anchor: '100%',
        fieldLabel: 'Start Date',
        name: 'date',
        format: 'Y-m-d',
        value: Ext.Date.add(new Date(), Ext.Date.DAY, -90),
    }, {
        xtype: 'datefield',
        id: 'endDateControl',
        anchor: '100%',
        fieldLabel: 'End Date',
        name: 'date',
        format: 'Y-m-d',
        value: new Date(),
    }],

    getStartDate: function() {
        return Ext.Date.format(Ext.getCmp('startDateControl').getValue(), 'Y-m-d');
    },

    getEndDate: function() {
        return Ext.Date.format(Ext.getCmp('endDateControl').getValue(), 'Y-m-d');
    }

});
