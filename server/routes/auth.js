const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const request = require('request');
const router = express.Router();

const User = require('../models/user');
const jwt = require('jsonwebtoken');

const dataStore = require('../assets/store');
var mysql = require('mysql');
var connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'uno'
});

const d = new Date();
const db = {
  updateOrCreate(user, cb) {
    // db dummy, we just cb the user
    cb(null, user);
  },
};

function serialize(req, res, next) {
  console.log('SERIALIZE RUNNING')
  db.updateOrCreate(req.user, (err, user) => {
    if (err) {
      return next(err);
    }
    // we store the updated information in req.user again
    req.user = user;
    next();
  });
}

function generateToken(req, res, next) {
  const sig = {
    id: req.user.id,
  };
  const secret = 'server secret';
  const expiration = {
    expiresIn: '30 days',
  };
  req.token = jwt.sign(sig, secret, expiration);
  next();
}

function respond(req, res) {
  res.status(200).json({
    user: req.user,
    token: req.token,
  });
}

// router.post('/login', (req, res) => {
//   console.log('HELLO FROM THE LOGIN ROUTE');
// },)

router.post('/login', passport.authenticate('local', {
  session: false,
}), serialize, generateToken, respond);

router.post('/signup', (req, res) => {
  const {
    password,
    username,
  } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = password ? bcrypt.hashSync(password, salt) : null;

  // connection.connect(function (error) {
  //   if (error) {
  //     console.error('SIGN UP ERROR', error);
  //     res.json({ error });
  //     connection.release();
  //   } else {
      const sql = `
      INSERT INTO users 
      (username,password,points,games,wins,drawed_cards,played_cards,time_played)
          VALUES ('${username}', '${passwordHash}',0,0,0,0,0,0);
        `;
      connection.query(sql, (error, results) => {
        if (error) {
          console.error('SIGN UP ERROR', error);
          res.json({ error });
          // connection.release();
        } else {
          connection.query(`SELECT * FROM users WHERE username = '${username}'`, (error, results) => {
            if (error) {
              console.error('SIGN UP ERROR', error);
              res.json({ error });
            } else {
              const user = results[0];
              req.user = user;
              res.json(user);
              // connection.release();
            }
          });
        }
      });
  //   }
  // });
}, passport.authenticate('local', {
  session: false,
}));

router.post('/logout', (req, res) => {
  console.log('logging out');
  req.logout();
  // res.redirect('/');
});

module.exports = router;