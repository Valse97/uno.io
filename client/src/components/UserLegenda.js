import React, { Component, Fragment } from 'react';

import Card from './Card';

class UserLegenda extends Component {
  state = {}

  renderCards(num) {
    var cards = [];
    for (var i = 0; i < num; i++) {
      cards.push(
        <Card
          className="covered"
          id={null}
          key={null}
          color={null}
          type={null}
          reversed={true}
          size={'small'}
        />)
    }
    return cards;
  }

  render() {
    const {
      users,
      currentPlayer
    } = this.props;

    return (
      <Fragment>
        <table
          className="UserLegenda"
        >
          {users.map((user, index) => {
            const {
              username,
              userId,
              cards
            } = user;

            var trClassName = currentPlayer == user.pos ? "highlight":""; 

            return (
              <tr key={'user-'+user.pos} className={trClassName}>
                <td>
                  <span>{username}</span>
                </td>
                <td>
                  {this.renderCards(cards)}
                </td>
              </tr>
            );
          })}
        </table>
      </Fragment>
    );
  }
}

export default UserLegenda;
