import React from 'react';

import data from '../assets/data';

const ColorModal = (props) => {
  const {
    visible,
    callback,
  } = props;

  var choices = [
    data.cardColor.Red,
    data.cardColor.Blue,
    data.cardColor.Yellow,
    data.cardColor.Green,
  ]

  return (
    <div className="Modal">
      <div className="view-box">
        <h2>{message}</h2>
        <div className="pieces">
          {choices.map((choice, index) => {

            var hex = data.cardColorHex[choice];
            var style = {
              background: gradient,
              color: hex.color,
            };

            return (
              <div
                key={index}
                onClick={() => callback(color)}
                className="piece"
                style={style}
              >
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default ColorModal;
