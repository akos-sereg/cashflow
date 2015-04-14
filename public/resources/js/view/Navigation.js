var navigationPanel = Ext.create('Ext.form.Panel', {
    border     : false,
    anchor     : '100%',
    margins: '0 0 0 0',
    items: [{
        xtype: 'button',
        id: 'expensesBtn',
        icon: '/resources/images/bar_chart.png',
        text: 'Expenses',
        scale: 'medium',
        anchor: '100%',
        handler : function() {
            navigationPanel.navigate('expense');
        }
    },
    {
        xtype: 'button',
        id: 'tagAssocBtn',
        icon: '/resources/images/icon-tags.png',
        text: 'Tag associations',
        scale: 'medium',
        anchor: '100%',
        margin: '10 0 0 0',
        handler : function() {
            navigationPanel.navigate('tagAssociations');
        }
    }],

    navigate: function(tabName) {

        // Hide all
        expensesPanel.getEl().hide();
        Ext.getCmp('expensesBtn').setIcon('/resources/images/bar_chart_off.png');
        Ext.getCmp('expensesBtn').getEl().dom.style.background = '#eeeeee';

        tagAssociationsPanel.getEl().hide();
        Ext.getCmp('tagAssocBtn').setIcon('/resources/images/icon-tags_off.png');
        Ext.getCmp('tagAssocBtn').getEl().dom.style.background = '#eeeeee';

        switch(tabName) {
            case 'expense':
                expensesPanel.getEl().show();
                Ext.getCmp('expensesBtn').setIcon('/resources/images/bar_chart.png');
                Ext.getCmp('expensesBtn').getEl().dom.style.background = '#dddddd';
                break;
            case 'tagAssociations':
                tagAssociationsPanel.getEl().show();
                Ext.getCmp('tagAssocBtn').setIcon('/resources/images/icon-tags.png');
                Ext.getCmp('tagAssocBtn').getEl().dom.style.background = '#dddddd';

                tagAssociationsGridController.load();
                break;
        }
    }

});