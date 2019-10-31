const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = 1212;
const con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "nodejsapi"
});
require('./Routes')(app, con);

// DB Connection - Eventually Move Into Own Class
try {
	con.connect(function(err) {
		if (err) throw err;
		console.log("Connected To Database!");
	});
} catch (error) {
	console.log("Failed To Connect To Database");
}

// Morgan Logging
app.use(morgan('short'));

// Body Parser
app.use(bodyParser.urlencoded({extended: false}));

app.listen(port , () => {
	console.log('Listening On Port: ' + port);
});