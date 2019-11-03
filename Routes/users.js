var bodyParser = require("body-parser");

module.exports = function (app, con) {
	
	// Body Parser
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	//#region Get

	// Get All Users
	app.get('/users', (req, res) => {
		const getAllUsersQuery = 'SELECT * FROM users';
		con.query(getAllUsersQuery, function (err, result, fields) {
			if (err) {
				console.log("Failed To Query For Users: " + err);
				res.sendStatus(500);
				return;
			}
			res.json(result);
			console.log(result);
		});
	});

	// Get Single User By Id
	app.get('/users/:id', (req, res) => {
		const userId = req.params.id;
		const getUserByIdQuery = 'SELECT * FROM users WHERE id = ?';
		con.query(getUserByIdQuery, [userId], (err, rows, fields) => {
			if (err) {
				console.log("Failed To Query For Users: " + err);
				res.sendStatus(500);
				return;
			}
			console.log('Fetched User' + userId);
			res.json(rows);
		});
	});
	//#endregion

	//#region Post

	// Create A User
	app.post('/register', (req, res) => {
		const registerUserQuery = 'INSERT INTO users (firstName, lastName, email, phoneNumber, username, password, isActive) VALUES ?';
		// (?, ?, ?, ?, ?, ?, ?)

		var values = [
			[req.body.firstName , req.body.lastName, req.body.email, req.body.phoneNumber, req.body.username, req.body.password, req.body.isActive]
		];

		con.query(registerUserQuery, [values], (err, rows, fields) => {
			if (err) {
				console.log("Failed To Insert New User: " + err);
				res.sendStatus(500);
				return;
			}
			console.log("Inserted New User");
			res.json(rows);
		});		
	});

	//#endregion
	
}