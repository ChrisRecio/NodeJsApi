module.exports = function (app, con) {

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
		const registerUserQuery = 'INSERT INTO users (firstName, lastName, email, phoneNumber, username, password) VALUES (?, ?, ?, ?, ?, ?)';

		var firstName = req.body.firstName;
		var lastName = req.body.lastName;
		var email = req.body.email;
		var phoneNumber = req.body.phoneNumber;
		var username = req.body.username;
		var password = req.body.password;

		con.query(registerUserQuery, [firstName, lastName, email, phoneNumber, username, password], (err, rows, fields) => {
			if (err) {
				console.log("Failed To Insert New User: " + err);
				res.sendStatus(500);
				return;
			}
			console.log('Fetched User' + userId);
			res.json(rows);
		});

		console.log("Inserted New User");
	})

	//#endregion
}