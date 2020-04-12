import React, { Component, Fragment } from 'react';

import Card from './Card';

class Board extends Component {
  state = {}

  render() {
    const {
      trash,
      chooseCard,
      drawCard,
    } = this.props;

    return (
      <Fragment>
        <div
          className="Board"
        // style={{
        //   height: boardWidth,
        //   width: boardWidth,
        // }}
        >
          <Card
            className="covered"
            id={null}
            key={null}
            color={null}
            type={null}
            reversed={true}
            drawCard={drawCard}
          />

          <Card
            id={trash.cardId}
            key={trash.cardId}
            color={trash.cardColor}
            type={trash.cardType}
            chooseCard={()=>{}}
          />
        </div>
      </Fragment>
    );
  }
}

export default Board;
