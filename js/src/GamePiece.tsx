import React from 'react';

interface GamePieceProps {
  id: number;
  left: number;
  top: number;
  pieceType: string;
  handleDragStart: (e: React.DragEvent, id: number) => void;
}

const GamePiece: React.FC<GamePieceProps> = ({ id, left, top, pieceType, handleDragStart }) => {
  const pieceStyle: React.CSSProperties = {
    position: 'absolute',
    // left: `${left}px`,
    // top: `${top}px`,
    // left: `${left - 25}px`,
    // top: `${top - 25}px`,
    cursor: 'pointer',
  };

  return (
    <img
      src={`assets/${pieceType}.png`}
      alt={pieceType}
      className="game-piece"
      style={pieceStyle}
      draggable
      onDragStart={(e) => handleDragStart(e, id)}
    />
  );
};

export default GamePiece;
