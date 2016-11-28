module.exports = {

	templates: [],

	connection: null,

	template: null,

	params: null,

	use: function(connection) {
		this.connection = connection;
	},

	getTemplate: function(templateName) {

		var self = this;
		var sql = null;

		this.templates.forEach(function(item) {

			if (templateName == item.name) {
				sql = item.sql;
			}
		});

		if (sql == null) {
			throw new Error('No template found with name "' + templateName + '"');
		}
		
		this.template = sql;
		return self;
	},

	fill: function(params) {
		this.params = params;
		return this;
	},

	execute: function(handler) {
		this.connection.query(this.template, this.params, handler);
	},
}