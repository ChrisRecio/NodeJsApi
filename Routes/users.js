module.exports = function(app, con) {

	app.get('/users', (req, res) => {
		const getAllUsersQuery = 'SELECT * FROM users'
		con.query(getAllUsersQuery, (err, rows, fields) => {
			console.log('Fetched All Users')
			res.json(rows)
		})
	})

	app.get('/users/:id' , (req, res) => {
		const userId = req.params.id
		const getUserByIdQuery = 'SELECT * FROM users WHERE id = ?'
		con.query(getUserByIdQuery, [userId], (err, rows, fields) => {
			console.log('Fetched User' + userId)
			res.json(rows)
		})
	})

}