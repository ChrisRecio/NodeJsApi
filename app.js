const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql');
const app = express();
const port = 1212;

var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	databse: 'nodejsapi'
});
  
con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
});


require('./Routes')(app, con)

app.use(morgan('short'));

app.listen(port , () => {
	console.log('Listening On Port: ' + port)
})