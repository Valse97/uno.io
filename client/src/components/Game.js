import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import { Redirect } from 'react-router-dom';

import data from '../assets/data';

import ColorModal from './ColorModal';
import Hand from './Hand';
import Board from './Board';
import UserLegenda from './UserLegenda';

// import pieceConstructors from '../assets/constructors/pieces';

const { baseAPI } = data;

class Game extends Component {
  state = {
    isPlaying: false,
    gameId: null,
    warning: null,
    ctx: null,
    users: [],
    success: true,
    showModal: false,
    modalCallback: null,
  }

  componentDidMount() {
    const gameId = this.props.match.params.id;
    this.setState({ gameId }, () => {

    });

    this.socket = io(baseAPI);

    this.socket.on('connect', () => {
      const userId = this.props.user.id;
      this.socket.emit('JOIN_ROOM', { gameId, userId }, (success) => {
        if (success) {
          this.socket.on('GAME_START', () => {
            this.setState({ isPlaying: true });
          });

          this.socket.on('UPDATE_GAME', ({ jsonGame }) => {
            var game = JSON.parse(jsonGame);
            console.log(game);
            this.setState({ ctx: game });
          });
        } else {
          this.setState({ success });
        }
      });

      this.socket.on('UPDATE_USERS', (users) => {
        console.log(users);
        this.setState({ users });
      });
    });
  }

  componentWillUnmount() {
    this.socket.close();
  }

  startGame = () => {
    this.socket.emit('START_GAME', {});
  }

  changeTurn = () => {
    this.socket.emit('CHANGE_TURN', (success, message) => {
      // if (success) {
      // } else {
      //   console.log(message);
      // }
    });
  }

  drawCard = () => {
    this.socket.emit('DRAW_CARD', (success, message) => {
      // if (success) {
      // } else {
      //   console.log(message);
      // }
    });
  }

  openChooseColorModal = (modalCallback) => {
    this.setState({ showModal: true, modalCallback });
  }
  closeChooseColorModal = () => {
    this.setState({ showModal: false });
  }

  chooseCard = (cardId, color, type) => {
    console.log(cardId);
    //CHANGE COLOR POPUP
    if (color == data.cardColor.None) {
      this.openChooseColorModal((newColor) => {
        this.discardCard(cardId, newColor);
      });
    } else {
      this.discardCard(cardId);
    }
  }
  discardCard = (cardId, color) => {
    this.socket.emit('DISCARD_CARD', cardId, color, (success, message) => {
      // if (success) {
      //   console.log(users);
      //   this.setState({ users });
      // } else {
      //   console.log(message);
      // }
    });
  }

  warn = (warning, clear) => {
    this.setState({ warning }, () => {
      if (clear) {
        setTimeout(() => {
          this.clearWarning();
        }, 2000);
      }
    });
  }

  render() {
    const {
      gameId,
      ctx,
      users,
      success,
      showModal,
      modalCallback,
    } = this.state;

    const chooseColorModal = (<div className={'chooseModal'}>

    </div>);

    const redirect = this.state.success ?
      null
      :
      <Redirect to="/" />;

    const warning = this.state.warning ?
      <h1>{this.state.warning}</h1>
      : null;

    const usersLi = users.map((user) =>
      (<li key={user.userId}>{user.username}</li>)
    );

    return this.state.isPlaying && this.state.ctx != null ? (
      <div className="Game">
        <ColorModal 
        visible={this.state.showModal}
        callback={this.state.modalCallback}
        />
        {redirect}
        <div className="warning">
          {warning}
        </div>
        <UserLegenda
          users={this.state.ctx.users}
          currentPlayer={this.state.ctx.currentPlayer}
        />
        <Board
          trash={this.state.ctx.trashedCard}
          chooseCard={this.chooseCard}
          drawCard={this.drawCard}
        />
        <Hand
          cards={this.state.ctx.cards}
          chooseCard={this.chooseCard}
          canPlay={this.state.ctx.canPlay}
          changeTurn={this.changeTurn}
        />
      </div>
    ) : (<div>
      <div>
        {redirect}
        <h5>USERS</h5>
        <ul>{usersLi}</ul>
      </div>
      <button onClick={this.startGame}>START</button>
    </div>);
  }
}

const mapStateToProps = state => ({
  user: state.userReducer.user,
});

export default connect(mapStateToProps)(Game);
