import React, { useState } from 'react';
import GamePiece from './GamePiece';

const GameBoard: React.FC = () => {
  const [pieces, setPieces] = useState([
    { id: 1, left: 0, top: 0, pieceType: 'orangekitten' },
    { id: 2, left: 80, top: 80, pieceType: 'orangekitten' },
    { id: 3, left: 160, top: 160, pieceType: 'brownkitten' },
    { id: 4, left: 240, top: 240, pieceType: 'brownkitten' },
    // Add other pieces here...
  ]);

  const handleDragStart = (e: React.DragEvent, pieceId: number) => {
    e.dataTransfer.setData('text/plain', pieceId.toString());
  };

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData('text/plain');
    const updatedPieces = pieces.map((piece) =>
      piece.id.toString() === pieceId ? { ...piece, left: col * 80, top: row * 80 } : piece
    );
    setPieces(updatedPieces);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="game-board">
      {Array.from({ length: 6 }).map((_, row) => (
        <div key={row} className="row">
          {Array.from({ length: 6 }).map((_, col) => (
            <div
              key={col}
              className="square"
              onDrop={(e) => handleDrop(e, row, col)}
              onDragOver={handleDragOver}
            >
              {pieces.map((piece) =>
                piece.left === col * 80 && piece.top === row * 80 ? (
                  <GamePiece
                    key={piece.id}
                    id={piece.id}
                    left={piece.left}
                    top={piece.top}
                    pieceType={piece.pieceType}
                    handleDragStart={handleDragStart}
                  />
                ) : null
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
