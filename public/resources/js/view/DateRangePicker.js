var dateRangePicker = Ext.create('Ext.form.FormPanel', {
    title      : 'Date Range Picker',
    width      : 800,
    height     : 280,
    collapsible: true,
    bodyPadding: 10,
    margins: '10 10 10 10',
    layout: 'hbox',
    defaults:{
        margins:'0 5 0 0',
        pressed: false,
    },
    items: [
    {
        layout: 'vbox',
        height: 230,
        border: false,
        items: [
        {
            xtype: 'label',
            html: 'Start Date:',
            margins: '0 0 5 0',
            width: 200
        },
        {
            xtype: 'datepicker',
            id: 'startDateControl',
            value: Ext.Date.add(new Date(), Ext.Date.DAY, -90),
            handler: function(picker, date) {
              // do something with the selected date
            }
        }],
    },
    {
            layout: 'vbox',
            height: 230,
            border: false,
            items: [
            {
                xtype: 'label',
                html: 'End Date:',
                margins: '0 0 5 0',
                width: 200
            },
            {
                xtype: 'datepicker',
                id: 'endDateControl',
                value: new Date(),
                handler: function(picker, date) {
                  // do something with the selected date
                }
            }],
        },
    {
         layout: 'vbox',
         width: 350,
         height: 500,
         border: false,
         items: [
         {
              layout: 'hbox',
              width: 280,
              border: false,
              items: [
              {
                  xtype: 'button',
                  text: '&laquo; One month back',
                  margins: '5 5 5 5'
              },
              {
                  xtype: 'button',
                  text: 'One month forward &raquo;',
                  margins: '5 5 5 5'
              }]
         },
         {
            xtype: 'button',
            text: 'Refresh Graph',
            margins: '5 5 5 5',
            handler: function () {
                cashflowChart.load(dateRangePicker.getStartDate(), dateRangePicker.getEndDate());
            }
         }]
    }],

    getStartDate: function() {
        return Ext.Date.format(Ext.getCmp('startDateControl').getValue(), 'Y-m-d');
    },

    getEndDate: function() {
        return Ext.Date.format(Ext.getCmp('endDateControl').getValue(), 'Y-m-d');
    }
});