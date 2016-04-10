// Initialize ext loader
Ext.Loader.setConfig({
    enabled : true,
    paths   : {
        Cashflow : 'resources/js'
    }
});

Ext.define('Cashflow.Application', {
    name: 'Cashflow',
    extend: 'Ext.app.Application',
    stores: [
        Ext.create('Cashflow.store.TagStore', { id: 'tagStore'} ),
        Ext.create('Cashflow.store.ExpectedExpenseTypeStore', { id: 'expectedExpenseTypeStore'} ),
    ],

    views: [
        //'Main'
    ],

    controllers: [
        //'Main'
    ]
});

Ext.application({
    name                : 'Cashflow',
    extend              : 'Cashflow.Application',
    appFolder           : 'resources/js',
    autoCreateViewport  : false,
});
