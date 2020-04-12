const games = [];

const add = function () {
    var game = new Uno();
    games.push(game);
    console.log('GAME CREATED', game.id);
    return game;
};
const addUser = function (gameId, userId, username, socketId) {
    var game = getById(gameId);
    if(game){
    game.users.push({ userId, username, socketId });
    update(game);
    console.log('USER JOINED', gameId, userId);
    return game;
    }else{
        return undefined;
    }
};
const removeUser = function (gameId, userId) {
    var game = getById(gameId);
    var users = game.users;
    const index = users.findIndex((_user) => _user.userId === userId);

    if (index !== -1) {
        game.users.splice(index, 1)[0];
    }

    if (game.users.length > 0) {
        update(game);
        return game;
    } else {
        remove(game.id);
        return undefined;
    }
};
const getUserIdBySocketId = function (socketId) {
    var game = getBySocketId(socketId);
    const user = game.users.find((_user) => _user.socketId === socketId);
    if (!user) {
        return undefined;
    } else {
        return user.userId;
    }
};
const getAllUsers = function (id) {
    var game = getById(id);
    return game.users;
};
const update = (game) => {
    const index = games.findIndex((_game) => _game.id === game.id);

    games[index] = game;
    return game;
};
const remove = function (id) {
    const index = games.findIndex((_game) => _game.id === id);

    if (index !== -1) {
        return games.splice(index, 1)[0];
    }
};
const getById = (id) => {
    return games.find((_game) => _game.id === id);
};
const getByUserId = (userId) => {
    return games.find((_game) => _game.users.find((_user) => _user.userId === userId) !== undefined);
};
const getBySocketId = (socketId) => {
    return games.find((_game) => _game.users.find((_user) => _user.socketId === socketId) !== undefined);
};

const getAll = function () {
    return games
};

module.exports = { add, update, remove, getById,getByUserId, getBySocketId, getUserIdBySocketId, getAll, getAllUsers, addUser, removeUser };

const gameState = {
    Closed: 0,
    Open: 1,
    Playing: 2,
}
// class UnoUser {
//     constructor(id, username) {
//         this.id = id;
//         this.username = username;
//         this.cards = [];
//         this.canDraw= false;
//     }
// }
class Uno {
    constructor() {
        this.id = (new Date()).getTime().toString() + "-" + Math.floor(Math.random() * 100).toString();
        this.state = gameState.Open;
        this.private = true;
        this.users = [];
        this.currentPlayer = 0;
        this.lastCardId = 0;
        this.turnNum = 0;
        this.isReverse = false;
        this.fullDeck = null;
        this.deck = null;
        this.trash = null;
        this.cardColor = {
            None: 0,
            Red: 1,
            Blue: 2,
            Yellow: 3,
            Green: 4,
        };
        this.cardType = {
            0: 0,
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            5: 5,
            6: 6,
            7: 7,
            8: 8,
            9: 9,
            Plus2: 10,
            Block: 11,
            Switch: 12,
            ChangeColor: 13,
            Plus4: 14,
        }
    }

    start() {
        var ctx = this;
        var deck = ctx.shuffleDeck(ctx.fillDeck());
        ctx.fullDeck = [ ...deck ];
        ctx.deck = deck;
        var userCards = ctx.fillUserCards(ctx.deck, 7);
        userCards.forEach((cards, i) => {
            ctx.users[i].cards = cards;
        })
        ctx.trash = [ctx.deck.pop()];
        ctx.state = gameState.Closed;
    }
    isOpen() {
        var ctx = this;
        return ctx.state == gameState.Open;
    }


    // draw(id) {
    //     var ctx = this;
    //     ctx.drawCard(id);
    //     if (!ctx.canPlayAnyCard()) {
    //         ctx.changeTurn();
    //     }
    // }
    // play(id, color) {
    //     var ctx = this;
    //     var card = ctx.findById(id);
    //     if (card.cardColor == ctx.cardColor.None) {
    //         //chooseColor(ctx.props)
    //         ctx.playCard(id, color);
    //     } else {
    //         ctx.playCard(id);
    //     }
    // }
    // changeTurn() {
    //     var ctx = this;
    //     ctx.changeTurn();
    // }

    fillDeck() {
        var ctx = this;
        var deck = [];
        Object.keys(ctx.cardType).forEach(function (type) {
            var card = ctx.cardType[type];
            if (card == ctx.cardType.Plus4 || card == ctx.cardType.ChangeColor) {
                for (var i = 0; i < 4; i++) {
                    ctx.lastCardId++;
                    deck.push({ cardType: card, cardColor: ctx.cardColor.None, cardId: ctx.lastCardId })
                }
            } else {
                Object.keys(ctx.cardColor).forEach(function (color) {
                    if (ctx.cardColor[color] > 0) {
                        for (var i = 0; i < (card == ctx.cardType[0] ? 1 : 2); i++) {
                            ctx.lastCardId++;
                            deck.push({ cardType: card, cardColor: ctx.cardColor[color], cardId: ctx.lastCardId })
                        }
                    }
                });
            }
        });
        return deck;
    }
    shuffleDeck(deck) {
        var ctx = this;
        for (var i = deck.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = deck[i];
            deck[i] = deck[j];
            deck[j] = temp;
        }
        return deck;
    }
    fillUserCards(deck, numCards) {
        var ctx = this;
        var playerCards = [];
        for (var i = 0; i < ctx.users.length; i++) {
            var cards = [];
            for (var j = 0; j < numCards; j++) {
                cards.push(deck.pop());
            }
            playerCards.push(cards);
        }
        return playerCards;
    }
    findById(id) {
        var ctx = this;
        var cards = ctx.fullDeck;
        return cards.find(x => x.cardId === id);
    }
    removeById(cards, id) {
        var ctx = this;
        cards.splice(cards.findIndex(function (i) {
            return i.cardId === id;
        }), 1);
    }
    canPlay(oldCard, newCard) {
        var ctx = this;
        if (oldCard.cardType == newCard.cardType || oldCard.cardColor == newCard.cardColor) {
            return true;
        } else if (newCard.cardColor == ctx.cardColor.None) {
            return true;
        }
        return false;
    }
    canPlayAnyCard() {
        var ctx = this;
        var player = ctx.currentPlayer;
        var _canPlay = false;
        var oldCard = ctx.trash[ctx.trash.length - 1];
        ctx.users[ctx.currentPlayer].cards.forEach(function (card) {
            if (ctx.canPlay(oldCard, card))
                _canPlay = true;
        });
        return _canPlay;
    }
    drawCard(playerId) {
        var ctx = this;
        if (playerId === undefined || playerId === null) {
            playerId = ctx.currentPlayer;
        }
        if (ctx.canDraw) {
            ctx.drawCardByPlayerId(playerId);//props.ctx.users[playerId].cards.push(getCardByDeck(props.G))
            ctx.canDraw = false;
        }
        return null;
    }
    drawCardByPlayerId(playerId) {
        var ctx = this;
        ctx.users[playerId].cards.push(ctx.getCardByDeck());
    }
    canPlayUserId(userId) {
        var ctx = this;
        var pos = ctx.users.findIndex((_user) => _user.userId === userId);
        return this.currentPlayer == pos;
    }
    playCard(cardId, cardColor) {
        var ctx = this;
        var cards = ctx.users[ctx.currentPlayer].cards;
        var card = ctx.findById(cardId);
        if (ctx.canPlay(ctx.trash[ctx.trash.length - 1], card)) {
            ctx.removeById(cards, cardId);
            ctx.users[ctx.currentPlayer].cards = cards;
            ctx.trash.push(card);
            var nextPlayerId = ctx.getNextPlayerId();
            switch (card.cardType) {
                case ctx.cardType.Block:
                    ctx.changeTurn();
                    break;
                case ctx.cardType.ChangeColor:
                    //CAMBIA COLORE
                    ctx.trash[ctx.trash.length - 1].cardColor = cardColor;
                    break;
                case ctx.cardType.Plus2:
                    for (var i = 0; i < 2; i++) {
                        ctx.drawCardByPlayerId(nextPlayerId);
                    }
                    break;
                case ctx.cardType.Plus4:
                    for (var i = 0; i < 4; i++) {
                        ctx.drawCardByPlayerId(nextPlayerId);
                    }
                    //CAMBIA COLORE
                    ctx.trash[ctx.trash.length - 1].cardColor = cardColor;
                    break;
                case ctx.cardType.Switch:
                    ctx.isReverse = !ctx.isReverse;
                    break;
            }
            ctx.changeTurn()
        } else {
            return false;
        }
    }
    getNextPlayerId() {
        var ctx = this;
        return ctx.getNextTurn();
    }
    getNextTurn() {
        var ctx = this;
        var _turnNum = ctx.turnNum + (ctx.isReverse ? -1 : 1);
        if (_turnNum < 0) {
            _turnNum = ctx.users.length - 1;
        } else if (_turnNum >= ctx.users.length) {
            _turnNum = 0;
        }
        return _turnNum;
    }
    changeTurn() {
        var ctx = this;
        var _turnNum = ctx.getNextTurn();
        ctx.turnNum = _turnNum;
        ctx.canDraw = true;
        //TODO: change turn
        this.currentPlayer = _turnNum;
        //ctx.events.endTurn({ next: _turnNum.toString() });
    }
    getCardByDeck() {
        var ctx = this;
        var card = ctx.deck.pop();
        if (ctx.deck.length === 0) {
            ctx.deck = ctx.shuffleDeck(ctx.fillDeck());
        }
        return card;
    }
}