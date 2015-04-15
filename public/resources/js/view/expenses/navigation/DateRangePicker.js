Ext.define('Cashflow.view.expenses.navigation.DateRangePicker', {
    extend: 'Ext.form.FormPanel',
    bodyPadding: 10,
    margins: '0 0 5 0',
    border: false,
    items: [{
        xtype: 'datefield',
        id: 'startDateControl',
        anchor: '100%',
        fieldLabel: 'Start Date',
        name: 'date',
        format: 'Y-m-d',
        value: Ext.Date.add(new Date(), Ext.Date.DAY, -90),
        listeners: {
            select: function(){
                dateRangePickerController.onRangeChanged();
            }
        },
    },
    {
        xtype: 'datefield',
        id: 'endDateControl',
        anchor: '100%',
        fieldLabel: 'End Date',
        name: 'date',
        format: 'Y-m-d',
        value: new Date(),
        listeners: {
            select: function(){
                dateRangePickerController.onRangeChanged();
            }
        },
    }],

    getStartDate: function() {
        return Ext.Date.format(Ext.getCmp('startDateControl').getValue(), 'Y-m-d');
    },

    getEndDate: function() {
        return Ext.Date.format(Ext.getCmp('endDateControl').getValue(), 'Y-m-d');
    },

    addMonths: function(months) {

        var startDate = Ext.getCmp('startDateControl').getValue();
        var endDate = Ext.getCmp('endDateControl').getValue();

        if (months == -1 && startDate.getDate() == 1) {
            // Going back to one month (adjusting to the beginning/end of the month)
            startDate.setDate(0);   // Last day of previous month
            endDate = new Date(startDate);  // ... will be the end date
            startDate.setDate(1);   // Set start date to the beginning of the month

            Ext.getCmp('startDateControl').setValue(startDate);
            Ext.getCmp('endDateControl').setValue(endDate);

            dateRangePickerController.onRangeChanged();
            return;
        }
        else if (months == 1 && startDate.getDate() == 1) {
            // Going one month forward (adjusting to the beginning/end of the month)
            startDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
            endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

            Ext.getCmp('startDateControl').setValue(startDate);
            Ext.getCmp('endDateControl').setValue(endDate);

            dateRangePickerController.onRangeChanged();
            return;
        }

        Ext.getCmp('startDateControl').setValue(Ext.Date.add(Ext.getCmp('startDateControl').getValue(), Ext.Date.MONTH, months));
        Ext.getCmp('endDateControl').setValue(Ext.Date.add(Ext.getCmp('endDateControl').getValue(), Ext.Date.MONTH, months));

        dateRangePickerController.onRangeChanged();
    },

    addDays: function(days) {
        Ext.getCmp('startDateControl').setValue(Ext.Date.add(Ext.getCmp('startDateControl').getValue(), Ext.Date.DAY, days));
        Ext.getCmp('endDateControl').setValue(Ext.Date.add(Ext.getCmp('endDateControl').getValue(), Ext.Date.DAY, days));

        dateRangePickerController.onRangeChanged();
    },

});
