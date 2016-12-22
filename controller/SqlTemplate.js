var sqlite3     = require('sqlite3').verbose();

module.exports = {

	templates: [],

	dataProvider: null,

	database: {
		mysql: {
			connection: null
		},
		sqlite3: {
			db: null,
		}
	},

	template: null,

	params: null,

	use: function(config) {
		
		this.dataProvider = config.databaseEngine;

		if (config.databaseEngine === 'mysql') {
			this.database.mysql.connection = mysql.createConnection(config.mysql);
			this.database.mysql.connection.connect();
		}
		else if (config.databaseEngine === 'sqlite3') {
			this.database.sqlite3.db = new sqlite3.Database(config.sqlite3.path);
		}
		else {
			this.dataProvider = null;
			throw new Error('Invalid database engine: ' + config.databaseEngine);
		}
	},

	dispose: function() {
		switch(this.dataProvider) {
			case 'mysql':
				this.database.mysql.connection.end();
				break;
		}
	},

	getTemplate: function(templateName) {

		var self = this;
		var tpl = null;

		this.templates.forEach(function(item) {

			if (templateName == item.name) {
				tpl = item;
			}
		});

		if (tpl == null) {
			throw new Error('No template found with name "' + templateName + '"');
		}
		
		this.template = tpl;
		return self;
	},

	fill: function(params) {
		this.params = params;
		return this;
	},

	execute: function(handler) {
		
		switch(this.dataProvider) {
			case 'mysql': 
				this.database.mysql.connection.query(this.template.mysql, this.params, handler);
				break;

			case 'sqlite3':
				var query = this.template.sqlite.replace(new RegExp('cashflow.', 'g'), '');
				console.log('Exec query: ' + query);
				console.log('With params: ');
				console.log(this.params);

				this.database.sqlite3.db.all(query, this.params, handler);
				break;

			default:
				break;
		}
	},
}