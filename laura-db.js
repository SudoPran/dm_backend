const mysql = require('mysql2');
const util = require("util");

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'laura'
});

connection.connect(err => {
  if (err) {
    console.error('An error occurred while connecting to the DB: ' + err.stack);
    return;
  }
  console.log('Connected to LAURA as ID ' + connection.threadId);
});

let promiseConnection = util.promisify(connection.query).bind(connection);

module.exports = promiseConnection;