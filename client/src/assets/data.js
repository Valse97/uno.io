// import card from './images/pieces/card.png';

const devAPI = 'http://localhost:5000';
const prodAPI = 'http://api.cardgame.uno';
// const baseAPI = process.env.REACT_APP_ENV === 'development' ? devAPI : prodAPI;
const baseAPI = prodAPI;

const data = {
  api: `${baseAPI}/api`,
  // api: prodAPI,
  baseAPI,
  icons: {
    // card
  },
  cardColor: {
    None: 0,
    Red: 1,
    Blue: 2,
    Yellow: 3,
    Green: 4,
  },
  cardColorHex: {
    0: {
      backgroundTopLeft: '#ff0000',
      backgroundBottomRight: '#ff0000',
      textColor: '#ffffff',
    },
    1: {
      backgroundTopLeft: '#ff0000',
      backgroundBottomRight: '#ff0000',
      textColor: '#ffffff',
    },
    2: {
      backgroundTopLeft: '#ff0000',
      backgroundBottomRight: '#ff0000',
      textColor: '#ffffff',
    },
    4: {
      backgroundTopLeft: '#ff0000',
      backgroundBottomRight: '#ff0000',
      textColor: '#ffffff',
    },
    5: {
      backgroundTopLeft: '#ff0000',
      backgroundBottomRight: '#ff0000',
      textColor: '#ffffff',
    },
  },
  cardType: {
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
  },
  gameState: {
    Closed: 0,
    Open: 1,
    Playing: 2,
  },
};

export default data;
