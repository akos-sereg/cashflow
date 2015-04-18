Ext.define('Cashflow.controller.tagassociations.grid.TagAssociationsGridController', {
    extend: 'Ext.app.Controller',

    load: function() {
        $.ajax({
            type: 'GET',
            url: '/api/getTagAssociations',
            success: function(data) {
                console.log('Tag Association list loaded from server: ' + data.length + ' records.');
                Ext.getCmp('tag-associations-grid').store.loadData(data);
                Ext.getCmp('tag-associations-grid').store.rawData = data;
            },
            contentType: 'application/json; charset=utf-8'
        });
    },
    removeTagAssociation: function(ruleId) {
         $.ajax({
            type: 'POST',
            url: '/api/removeTagAssociation',
            data: { ruleId: ruleId },
            success: function(data) {

                if (data.isSuccess) {
                    Ext.getCmp('tag-associations-grid').controller.load();
                    return;
                }

                console.log(data.errorMessage);
            },
            contentType: 'application/x-www-form-urlencoded'
        });
    }
});
