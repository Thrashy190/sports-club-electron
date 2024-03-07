const mysql = require("promise-mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "its",
  password: "itspassword",
  database: "sport_club_db",
});

function getConnection() {
  return connection;
}

module.exports = { getConnection };
