// const {
//   Client,
// } = require('pg');
var mysql = require('mysql');
var connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'uno'
});

const initializeUsers = () => {
  const client = new Client();
  const sql = 'CREATE TABLE users(id int(11) NOT NULL auto_increment, username varchar(250) NOT NULL, password varchar(250) NOT NULL, PRIMARY KEY ("id"), CONSTRAINT users_username_unique UNIQUE (username))';

  // connection.connect(function (error) {
  //   if (error) {
  //     console.error(error);
  //     connection.release();
  //   } else {
      connection.query(sql, (error, results) => {
        if (error) {
          console.error(error);
        }else{
          console.log('SUCCESSFULLY CREATED TABLE');
        }
        // connection.release();
      });
  //   }
  // });
}

module.exports = {
  initializeUsers,
}