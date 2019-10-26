const userRoutes = require('./users');

module.exports = function(app, con) {
	userRoutes(app, con);
}