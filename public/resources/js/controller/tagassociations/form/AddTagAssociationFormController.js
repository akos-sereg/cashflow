Ext.define('Cashflow.controller.tagassociations.form.AddTagAssociationFormController', {
    extend: 'Ext.app.Controller',

    addTagAssociation: function(ruleName, pattern, tagLabel) {

        var tagAssociation = {
            ruleName  : ruleName,
            pattern   : pattern,
            tagLabel  : tagLabel,
        };

        $.ajax({
            type: 'POST',
            url: '/api/addTagAssociation',
            data: tagAssociation,
            success: function(data) {

                if (data.isSuccess) {
                    tagAssociationsGridController.load();
                    addTagAssociationForm.clear();
                }
                else {
                    console.log(data.errorMessage);
                }
            },
            contentType: 'application/x-www-form-urlencoded'
        });

    }
});
