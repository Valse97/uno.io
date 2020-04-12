// import card from './images/pieces/card.png';

const devAPI = 'http://localhost:5000';
const prodAPI = 'http://127.0.0.1:5000';
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
