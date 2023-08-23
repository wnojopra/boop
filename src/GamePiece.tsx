import React from 'react';
import { Age, Color, Piece } from './BoopTypes';
import brownkitten from "./assets/brownkitten.png";
import browncat from "./assets/browncat.png";
import orangekitten from "./assets/orangekitten.png";
import orangecat from "./assets/orangecat.png";

interface GamePieceProps {
  piece: Piece;
}

const GamePiece: React.FC<GamePieceProps> = ({ piece }) => {

  return (
    <img
      src={piece.color === Color.BROWN ? 
           ( piece.age === Age.KITTEN ? brownkitten : browncat ) : 
           ( piece.age === Age.KITTEN ? orangekitten : orangecat )
          }
      alt=""
      className="game-piece"
    />
  );
};

export default GamePiece;
