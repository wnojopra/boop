import React, { MouseEvent, useState } from 'react';
import GamePiece from './GamePiece';
import brownkitten from "./assets/brownkitten.png";
import orangekitten from "./assets/orangekitten.png";

interface GameBoardProps {
  onChange: (coord: [number, number]) => void;
};

const GameBoard: React.FC<GameBoardProps> = ({ onChange }) => {
  const [pieces] = useState([
    { id: 1, left: 2, top: 2, pieceType: orangekitten },
    { id: 2, left: 2, top: 3, pieceType: orangekitten },
    { id: 3, left: 3, top: 2, pieceType: brownkitten },
    { id: 4, left: 3, top: 3, pieceType: brownkitten },
    // Add other pieces here...
  ]);
  const [selectedSquare, setSelectedSquare] = useState<number | null>(null);

  const handleClick = (e: MouseEvent, row: number, col: number): void => {
    e.preventDefault();
    onChange([row, col]);
    setSelectedSquare(row * 6 + col);
  };

  return (
    <div className="game-board">
      {Array.from({ length: 6 }).map((_, row) => (
        <div key={row} className="row">
          {Array.from({ length: 6 }).map((_, col) => (
            <div
              key={col}
              className={`square ${selectedSquare === row * 6 + col ? 'selected' : ''}`}
              onClick={(e) => handleClick(e, row, col)}
            >
              {pieces.map((piece) =>
                piece.left === col && piece.top === row ? (
                  <GamePiece
                    key={piece.id}
                    id={piece.id}
                    left={piece.left}
                    top={piece.top}
                    pieceType={piece.pieceType}
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
