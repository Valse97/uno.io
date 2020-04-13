const bcrypt = require('bcryptjs');
var mysql = require('mysql');
var connection = mysql.createPool({
  host: 'localhost',
  user: 'valse',
  password: 'Stocazzo2020!',
  database: 'uno'
});

var users = [];

connection.query(`select * from users`, (error, results) => {
  users = results;
});

const checkPassword = function (password, passwordHash) {
  return bcrypt.compareSync(password, passwordHash);
};

const checkUser = function (username, password, done) {
  console.log('CHECK USER FUNCTION RUNNING', username, password);

  // connection.connect(function (error) {
  //   if (error) {
  //     console.log("Error mysql");
  //     connection.release();
  //   } else {
      const sql = `SELECT * FROM users WHERE username = '${username}'`;

      connection.query(sql, (error, results) => {
        console.log('username results', results);
        const user = results[0];

        // connection.release();
        if (user && checkPassword(password, user.password)) {
          console.log('Should be a successful login');
          done(null, user);
        } else {
          console.log('The user probably entered the incorrect password');
          done(null, false);
        }
      });
    // }
  // });
};

const getById = function(id){
  return users.find((_user) => _user.id === id);
}

module.exports = { checkUser,getById };