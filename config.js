module.exports = {

	// Expenses will be considered in this currency - this is just for displaying purposes
	currency: 'HUF',

	// Database engine
	databaseEngine: 'sqlite3', // <sqlite3|mysql>

	// MySQL configuration
	mysql: { 
		host: 'localhost', 
		user: 'root',
		password: '******'
	},

	// SQLite3 configuration
	sqlite3: { 
		path: './db/database.sqlite3',
	},

	// Request authorization
	allowedIpRange: '::ffff:192.168.1.*'
}