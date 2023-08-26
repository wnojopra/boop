import React, { MouseEvent, useState } from 'react';
import GamePiece from './GamePiece';
import { Board, HEIGHT } from './BoopTypes';


interface GameBoardProps {
  onChange: (coord: [number, number]) => void;
  board: Board
};

const GameBoard: React.FC<GameBoardProps> = ({ onChange, board }) => {
  const [selectedSquare, setSelectedSquare] = useState<number | null>(null);

  const handleClick = (e: MouseEvent, row: number, col: number): void => {
    e.preventDefault();
    onChange([row, col]);
    setSelectedSquare(row * HEIGHT + col);
  };

  return (
    <div className="game-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((piece, columnIndex) => (
            <div
              key={columnIndex}
              className={`square ${selectedSquare === rowIndex * HEIGHT + columnIndex ? 'selected' : ''}`}
              onClick={(e) => handleClick(e, rowIndex, columnIndex)}
            >
              {piece ? (
                  <GamePiece
                    piece={piece}
                  />
                ) : null
              }
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
