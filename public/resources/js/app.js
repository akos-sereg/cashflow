// TagStore is required by multiple components
var tagStore = Ext.create('Ext.data.Store', {
	autoLoad: true,
	fields: [
        {name: 'id', type: 'int'},
        {name: 'label', type: 'string'}
    ],
	proxy: {
        type: 'ajax',
        url: '/api/getTags',
        reader: {
        	type: 'json',
        	root: 'data'
        }
    },
    listeners: {
    	load: function(){
    		console.log('Tag store loaded');
    	}
    }
});

// Initialize ext loader
Ext.Loader.setConfig({
    enabled : true,
    paths   : {
        Cashflow : 'resources/js'
    }
});