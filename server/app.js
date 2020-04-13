require('dotenv').config();

const express = require('express');
const cors = require('cors')
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const socket = require('socket.io');

const dbConfig = require('./db.config');

const User = require('./models/user');
const Game = require('./models/game');

app.use(cors())

// dbConfig.initializeUsers();

const PORT = process.env.PORT || 5000;


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Max-Age', 1728000);

  next();
});

// app.use(cookieSession({
//   name: 'session',
//   keys: ['unoPassword!'],

//   // Cookie Options
//   maxAge: 24 * 60 * 60 * 1000, // 24 hours

//   path: '/*', // NEEDED
// }));
app.use(session({
  secret: 'unoPassword!',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 60000 },
  rolling: true,
  path: '/*', // NEEDED
}));

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json({
  limit: '50mb',
}));

app.use(passport.initialize());
app.use(passport.session());
require('./passportconfig').configure(passport);

app.use('/api/auth/', require('./routes/auth'));

const server = app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('SOCKET IS CONNECTED');
  io.emit('UPDATE_GAMES', Game.getAll());
  // here you can start emitting events to the client
  socket.on('CREATE_ROOM', (user, callback) => {
    var game = Game.add();
    io.emit('UPDATE_GAMES', Game.getAll());
    callback(game);
  });

  socket.on('RECOVER_ROOM', (game, callback) => {
    // game.id = Math.floor(Math.random() * 100000000);
    // io.emit('START_GAME', game);
    Game.addUser(game.id, game.userId, game.username, socket.id);
  })

  socket.on('JOIN_ROOM', (data, callback) => {
    const { gameId, userId } = data;
    console.log('INCOMING ROOM', gameId);
    var game = Game.getById(gameId);
    if (!game || !game.isOpen()) {
      console.log(`USER ${userId} BLOCKED ON ROOM #${gameId} with socket ${socket.id}`);
      callback(false);
    } else {
      var prevGame = Game.getByUserId(userId);
      if (prevGame) {
        if (Game.removeUser(prevGame.id, userId) != undefined) {
          socket.to(prevGame.id).emit('UPDATE_USERS', Game.getAllUsers(prevGame.id));
          socket.emit('UPDATE_USERS', Game.getAllUsers(prevGame.id));
          io.emit('UPDATE_GAMES', Game.getAll());
        }
      }
      socket.join(gameId);
      var user = User.getById(userId);
      if (Game.addUser(game.id, userId, user.username, socket.id) !== undefined) {
        console.log(`USER ${userId} JOINED ROOM #${gameId} with socket ${socket.id}`);
        socket.to(gameId).emit('UPDATE_USERS', Game.getAllUsers(gameId));
        socket.emit('UPDATE_USERS', Game.getAllUsers(gameId));
        io.emit('UPDATE_GAMES', Game.getAll());
        callback(true);
      } else {
        callback(false);
      }
    }
  });

  socket.on('START_GAME', () => {
    var game = Game.getBySocketId(socket.id);
    if (game) {
      //TODO: RIMUOVERE COMMENTO
      // if (game.users.length >= 2) {
      game.start();
      io.emit('GAME_START');

      updateGame(game);

      io.emit('UPDATE_GAMES', Game.getAll());
      // } else {
      //   console.error("NOT ENOUGH USERS");
      // }
    } else {
      console.error("GAME NOT FOUND");
    }
  });

  socket.on('DISCARD_CARD', (cardId, color, callback) => {
    var game = Game.getBySocketId(socket.id);
    var userId = Game.getUserIdBySocketId(socket.id);
    if (game && userId) {
      if (game.canPlayUserId(userId)) {
        game.playCard(cardId, color);
        updateGame(game);
        callback(true, "");
      } else {
        callback(false, "CANNOT PLAY");
      }
    } else {
      callback(false, "CANNOT PLAY");
    }
  });

  socket.on('DRAW_CARD', (callback) => {
    var game = Game.getBySocketId(socket.id);
    var userId = Game.getUserIdBySocketId(socket.id);
    if (game && userId) {
      if (game.canPlayUserId(userId)) {
        game.drawCard();
        updateGame(game);
        callback(true, "");
      } else {
        callback(false, "CANNOT PLAY");
      }
    } else {
      callback(false, "CANNOT PLAY");
    }
  });

  socket.on('CHANGE_TURN', (callback) => {
    var game = Game.getBySocketId(socket.id);
    var userId = Game.getUserIdBySocketId(socket.id);
    if (game && userId) {
      if (game.canPlayUserId(userId)) {
        if (!game.canDraw) {
          game.changeTurn();
          updateGame(game);
          callback(true, "");
        } else {
          callback(false, "DRAW A CARD");
        }
      } else {
        callback(false, "CANNOT PLAY");
      }
    } else {
      callback(false, "CANNOT PLAY");
    }
  });

  const updateGame = (game) => {
    game.users.forEach((user) => {
      var socketId = user.socketId;
      var pos = game.users.findIndex((_user) => _user.userId === user.userId);

      var _users = [];
      game.users.forEach((user, index) => {
        _users.push({
          username: user.username,
          userId: user.userId,
          pos: index,
          cards: user.cards.length,
        });
      });

      var _game = {
        ...user,
        state: game.state,
        private: game.private,
        users: _users,
        currentPlayer: game.currentPlayer,
        trashedCard: game.trash[game.trash.length - 1],
        canPlay: (game.currentPlayer == pos),
      };
      io.to(`${socketId}`).emit('UPDATE_GAME', { jsonGame: JSON.stringify(_game) });
    })
  }

  socket.on('disconnect', () => {
    var game = Game.getBySocketId(socket.id);
    if (game) {
      var userId = Game.getUserIdBySocketId(socket.id);
      if (Game.removeUser(game.id, userId) != undefined) {
        socket.to(game.id).emit('UPDATE_USERS', Game.getAllUsers(game.id));
        socket.emit('UPDATE_USERS', Game.getAllUsers(game.id));
        io.emit('UPDATE_GAMES', Game.getAll());
      }
    }
  })

});

const gameIo = socket(server, { path: '/game/:id' });

gameIo.on('connection', (socket) => {
  console.log('SOCKET IS CONNECTED TO GAME');
  socket.on('disconnect', (ids) => {
    console.log(ids);
  })
});