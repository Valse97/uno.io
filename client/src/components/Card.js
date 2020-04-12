import React, { Component } from 'react';

import data from '../assets/data';

class Card extends Component {
  handleClick = () => {
    const {
      id,
      color,
      type,
      reversed,
      chooseCard,
      drawCard,
    } = this.props;

    if(reversed != undefined && reversed == true){
      drawCard();
    }else{
      chooseCard(id);
    }
    //TODO: GIOCARE CARTA
  }

  render() {
    const {
      id,
      color,
      type,
      size
    } = this.props;

    var card = {};

    if (id != undefined && id != null && id != "") {
      switch (color) {
        case data.cardColor.Blue:
          card.color = "white";
          card.background = "#0661a7";
          break;
        case data.cardColor.Green:
          card.color = "white";
          card.background = "#75b90e";
          break;
        case data.cardColor.Red:
          card.color = "white";
          card.background = "#d0250a";
          break;
        case data.cardColor.Yellow:
          card.color = "white";
          card.background = "#ffd23a";
          break;
        case data.cardColor.None:
          card.color = "white";
          card.background = "#353331";
          break;
      }
      card.changeColor = false;
      if (type == null) {
        card.color = "white";
        card.background = "#ff0000";
        card.text = "UNO";
      } else if (type < 10) {
        card.text = type;
      } else {
        switch (type) {
          case data.cardType.Block:
            card.text = "B";
            break;
          case data.cardType.Switch:
            card.text = "S";
            break;
          case data.cardType.Plus2:
            card.text = "+2";
            break;
          case data.cardType.Plus4:
            card.text = "+4";
            card.changeColor = true;
            break;
          case data.cardType.ChangeColor:
            card.text = "C";
            card.changeColor = true;
            break;
        }
      }
    } else {
      card.color = "white";
      card.background = "#ff0000";
      card.text = "UNO";
    }
    var style = {
      background: card.background,
      color: card.color,
    };

    var _size = size;
    if(_size==undefined){
      _size = 'normal';
    }
    const className = `CardContainer ${_size}`;

    return (<div
      className={className}
      onClick={this.handleClick}
    ><div
      className="Card"
      style={style}
    >
        <div className="top-left">{card.text}</div>
        <div className="center">{card.text}</div>
      </div>
    </div>);
  }
}

export default Card;