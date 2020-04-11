import ChessPiece from './ChessPiece';
import data from '../data';
import Helpers from '../helpers';

const helpers = new Helpers();

const {
  findCurrentKnightMoves,
} = helpers;

const {
  blackKnight,
  whiteKnight,
} = data.icons;

class Knight extends ChessPiece {
  constructor(color, row, column) {
    super(color, row, column);
    this.label = 'Knight';
    this.type = 'knight';
    this.icon = color === 'black' ? blackKnight : whiteKnight;
    this.generateCurrentOptions = (knight, squares, pieceRow, pieceCol, pieces) => {
      return findCurrentKnightMoves(knight, squares, pieceRow, pieceCol, pieces);
    };
  }
}

export default Knight;