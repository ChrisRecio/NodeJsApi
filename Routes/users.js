const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');

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

			// Checks If A User Was Returned
			if(isEmptyObject(rows)){
				res.json("No Users Found");
			}else{
				res.json(rows);
			}

			res.json(rows);
		});
	});
	//#endregion

	//#region Post

	// Create A User
	app.post('/register', verifyToken, (req, res) => {
		const registerUserQuery = 'INSERT INTO users (firstName, lastName, email, phoneNumber, username, password, isActive) VALUES ?';

		var values = [
			[req.body.firstName , req.body.lastName, req.body.email, req.body.phoneNumber, req.body.username, req.body.password, req.body.isActive]
		];

		jwt.verify(req.token, 'secretKey', (err, authData) => {
			if (err) {
				res.sendStatus(500);
			}else{
				con.query(registerUserQuery, [values], (err, rows, fields) => {
					if (err) {
						res.sendStatus(500);
						return;
					}
					jwt.sign({rows}, 'secretKey', (err, token) => {
						res.json(token);
					})
				});	
			}
		});		
	});

	// Edit A Users Password
	app.post('/changePassword', verifyToken, (req, res) => {
		const getUserByIdQuery = 'SELECT * FROM users WHERE id = ?';
		const updateUserByIdQuery = 'UPDATE users SET password = ? WHERE id = ?';
		const userId = req.body.id;
		const password = req.body.password;
		
		jwt.verify(req.token, 'secretKey', (err, authData) => {
			if (err) {
				res.sendStatus(500);
			}else{

				// Checks If User Exists
				con.query(getUserByIdQuery, [userId], (err, rows, fields) => {
					if (err) {
						console.log("Failed To Query For Users: " + err);
						res.sendStatus(500);
						return;
					}else { // If Exists Run Update Query
						con.query(updateUserByIdQuery, [password, userId], (err, rows, fields) =>{
							if(err){
								res.sendStatus(500);
								return;
							}else{
								jwt.sign({rows}, 'secretKey', (err, token) => {
									res.json(token);
								})
							}					
						});
					}  
					
				});

			}

		});
	
	});

	// Login
	app.post('/login', verifyToken, (req, res) => {
		const loginQuery = 'SELECT * FROM users WHERE username = ? AND password = ? AND isActive = 1';
		const username = req.body.username;
		const password = req.body.password;

		jwt.verify(req.token, 'secretKey', (err, authData) => {
			if (err) {
				res.sendStatus(500);
			}else{

				con.query(loginQuery, [username, password], (err, rows, fields) => {			
			
					if (err) {
						console.log("Failed Login Query For Users: " + err);
						res.sendStatus(500);
						return;
					}else{
		
						// Checks If A User Was Returned
						if(isEmptyObject(rows)){
							res.json("Invalid Login Credentials");
						}else{
							jwt.sign({rows}, 'secretKey', (err, token) => {
								res.json(token);
							});
							
						}
					}
				});

			}

		});
	});

	//#endregion

	//#region Functions

	function verifyToken(req, res, next) {
		
		const bearerHeader = req.headers['authorization'];
		
		if(typeof bearerHeader !== 'undefined') {
		  
		  const bearer = bearerHeader.split(' ');
		  
		  const bearerToken = bearer[1];
		  
		  req.token = bearerToken;
		  
		  next();
		} else {
		  // Forbidden
		  res.sendStatus(403);
		}
	  
	}

	function isEmptyObject(obj) {
		return !Object.keys(obj).length;
	}

	//#endregion
}