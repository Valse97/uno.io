import React, { Component, Fragment } from 'react';

import Card from './Card';

class Hand extends Component {
  state = {}

  render() {
    const {
      cards,
      chooseCard,
      canPlay,
      changeTurn
    } = this.props;

    var className = `Hand ${canPlay ? "canPlay" : ""}`;

    return (
      <Fragment>
        <div className="changeTurn">
          <button onClick={changeTurn}>CHANGE TURN</button>
        </div>

        <div className="HandContainer">
          <div
            className={className}
          // style={{
          //   height: boardWidth,
          //   width: boardWidth,
          // }}
          >

            {cards.map((card, index) => {
              const {
                cardType,
                cardColor,
                cardId
              } = card;

              return (
                <Card
                  id={cardId}
                  key={cardId}
                  color={cardColor}
                  type={cardType}
                  chooseCard={chooseCard}
                />
              );
            })}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Hand;
