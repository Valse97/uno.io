import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import io from 'socket.io-client';

import data from '../assets/data';

const { baseAPI } = data;

class Home extends Component {
  state = {
    error: null,
    gameId: null,
    waiting: false,
    games: [],
  }

  componentDidMount() {
    this.socket = io(baseAPI);

    this.socket.on('connection', () => {
      console.log('CONNECTED');
    });

    this.socket.on('UPDATE_GAMES', (games) => {
      this.setState({
        games: games
      });
    });
  }

  componentWillUnmount() {
    this.socket.removeAllListeners();
    this.socket.close();
  }

  restoreGame = () => {
    //TODO:
    const { user } = this.props;
    const data = {
      userId: user.id,
      username: user.username,
    };
    this.socket.emit('RECOVER_GAME', data, (recover) => {
      if (recover == true) {

      }
    });
  }

  createGame = () => {
    const { user } = this.props;
    const data = {
      userId: user.id,
      username: user.username,
    };
    this.socket.emit('CREATE_ROOM', data, (game) => {
      this.setState({
        gameId: game.id,
      });
    });
    this.setState({ waiting: true }, () => {
      //   setTimeout(() => {
      //     this.socket.on('RECEIVE_GAME', (game) => {
      //       this.receiveGame(game);
      //     });
      //   }, 500);
      //   // this.stopWaiting = setTimeout(() => {
      //   //   this.socket.removeListener('RECEIVE_GAME');
      //   //   this.setState({
      //   //     error: 'Could not find an opponent at this time',
      //   //     waiting: false,
      //   //   });
      //   //   setTimeout(() => {
      //   //     this.setState({ error: null });
      //   //   }, 2000);
      //   // }, 10000);
    });
  }

  joinGame = (game) => {
    // clearTimeout(this.stopWaiting);
    this.setState({ waiting: false }, () => {
      // this.socket.removeListener('RECEIVE_GAME');
      // this.socket.emit('JOIN_GAME', game);
    });
    this.setState({
      gameId: game.id,
    });
  }

  render() {
    const {
      error,
      gameId,
      waiting,
      games,
    } = this.state;

    const { user } = this.props;

    const redirect = gameId ?
      <Redirect to={`/game/${gameId}`} />
      :
      null;

    const buttonText = waiting ? 'Create room' : 'Create room';
    const errorMessage = error ?
      (
        <p style={{ color: 'red' }}>{error}</p>
      ) : null;

    const gamesLi = games.map((game) =>
      game.state == data.gameState.Open ?
        (<li key={game.id} onClick={() => { this.joinGame(game) }}>{game.username} - {game.users.length} {game.users.length == 1 ? 'user' : 'users'}</li>)
        :
        (<li key={game.id}>PLAYING: {game.username} - {game.users.length} {game.users.length == 1 ? 'user' : 'users'}</li>)
    );

    return (
      <div className="Home">
        {redirect}
        <h1>Welcome, {user.username}</h1>
        {/* <p>To play an opponent, click below. Or to play locally, click &quot;Single Player&quot; in the navigation bar above.</p> */}
        <button
          disabled={waiting}
          onClick={this.createGame}
        >
          {buttonText}
        </button>
        {errorMessage}

        <div>
          <h5>ROOMS</h5>
          <ul>{gamesLi}</ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.userReducer.user,
});

const mapDispatchToProps = dispatch => ({
  addGame: (game) => {
    const action = { type: 'ADD_GAME', game };
    dispatch(action);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);