Ext.define('Cashflow.store.TagStore', {
    extend: 'Ext.data.Store',
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