const passportJWT = require("passport-jwt");

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;
var mysql = require('mysql');
var connection = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'uno'
});

const User = require('./models/user');

function configure(passport) {
  const strategyFunc = function (username, password, done) {
    console.log('STRATEGY FUNC RUNNING');
    User.checkUser(username.toLowerCase(), password, (err, user) => {
      if (err) {
        console.log('Local Strategy - Error trying to authenticate.');
        done(err);
      } else if (user) {
        console.log('Local Strategy - Success');
        done(null, user);
      } else {
        console.log('Local Strategy - Could not find user');
        done(null, false);
      };
    });
  };
  passport.use(new LocalStrategy({
    usernameField: 'username',
  }, strategyFunc))
  // passport.use(new JWTStrategy({
  //   jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  //   secretOrKey: 'unoPassword!'
  // },
  //   function (jwtPayload, cb) {
  //     try {
  //       var user = User.getById(jwtPayload.id)
  //       return cb(null, user);
  //     } catch (e) {
  //       return cb(err);
  //     };
  //   }
  // ));
  passport.serializeUser((user, done) => {
    console.log('serializeUser', user);
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    console.log('deserializeUser', user);
    const userId = user.id;
    const client = new Client();

    // connection.connect(function (error) {
    //   if (error) {
    //     connection.release();
    //     throw error;
    //   } else {
    const sql = `SELECT * FROM users WHERE id = ${userId}`;
    connection.query(sql, (error, results) => {
      if (error) {
        throw error;
      } else {
        const user = results[0];
        done(null, user);
      }
      // connection.release();
    });
    //   }
    // });
  });
}


module.exports = { configure };