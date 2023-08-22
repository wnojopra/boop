import React from 'react';


interface GamePieceProps {
  id: number;
  left: number;
  top: number;
  pieceType: string;
}

const GamePiece: React.FC<GamePieceProps> = ({ id, left, top, pieceType }) => {
  const pieceStyle: React.CSSProperties = {
    position: 'absolute',
    cursor: 'pointer',
  };

  return (
    <img
      src={pieceType}
      alt={pieceType}
      className="game-piece"
      style={pieceStyle}
    />
  );
};

export default GamePiece;
