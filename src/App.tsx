import React, { useState } from 'react';
import GameBoard from './GameBoard';
import './App.css';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { arePiecesEqual, Age, Board, Coord, Color, Piece, HEIGHT, WIDTH } from './BoopTypes';


const initBoardState = (): Board => {
  const initialBoard: Board = [];

  for (let x = 0; x <= 5; x++) {
    initialBoard[x] = [];
    for (let y = 0; y <= 5; y++) {
      initialBoard[x][y] = null;
    }
  }

  return initialBoard;
};

const colorEnumToStr = (color: Color): string => {
  return color === Color.ORANGE ? "Orange" : "Brown"
}

const App: React.FC = () => {
  const [board, setBoard] = useState<Board>(initBoardState);
  const [coord, setCoord] = useState<Coord>([0, 0]);
  const [ageSwitch, setAgeSwitch] = useState<Age>(Age.KITTEN);
  const [currentTurn, setCurrentTurn] = useState<Color>(Color.ORANGE);
  const [numOrangeKittens, setNumOrangeKittens] = useState<number>(8);
  const [numBrownKittens, setNumBrownKittens] = useState<number>(8);
  const [numOrangeCats, setNumOrangeCats] = useState<number>(0);
  const [numBrownCats, setNumBrownCats] = useState<number>(0);
  const [turnCounter, setTurnCounter] = useState<number>(1);
  const [winner, setWinner] = useState<Color|null>(null);
  
  const handleSquareClick = (coord: [number, number]) => {
    setCoord(coord);
  };

  const handleAgeSwitchChange = () => {
    setAgeSwitch(ageSwitch === Age.KITTEN ? Age.CAT : Age.KITTEN);
  };

  const updateCatCount = (age: Age | undefined, color: Color | undefined, delta: number) => {
    if (age === Age.KITTEN && color === Color.ORANGE) {
      setNumOrangeKittens(numOrangeKittens + delta);
    } else if (age === Age.KITTEN && color === Color.BROWN) {
      setNumBrownKittens(numBrownKittens + delta);
    } else if (age === Age.CAT && color === Color.ORANGE) {
      setNumOrangeCats(numOrangeCats + delta);
    } else if (age === Age.CAT && color === Color.BROWN) {
      setNumBrownCats(numBrownCats + delta);
    } else {
      window.alert(`Error: updating cat count with age ${age} and color ${color}`)
    }
  };

  const check_winner = (updatedBoard: Board): Color|null => {
    // Check rows
    for (let x = 0; x < WIDTH; x++) {
      for (let y = 0; y < HEIGHT - 2; y++) {
        const p1 = updatedBoard[x][y];
        const p2 = updatedBoard[x][y + 1];
        const p3 = updatedBoard[x][y + 2];
        if (arePiecesEqual(p1, p2) && arePiecesEqual(p2, p3) && p1?.age === Age.CAT) {
          return p1.color;
        }
      }
    }

    // Check columns
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH - 2; x++) {
        const p1 = updatedBoard[x][y];
        const p2 = updatedBoard[x + 1][y];
        const p3 = updatedBoard[x + 2][y];
        if (arePiecesEqual(p1, p2) && arePiecesEqual(p2, p3) && p1?.age === Age.CAT) {
          return p1.color;
        }
      }
    }

    // Check diagonals
    for (let y = 0; y < HEIGHT - 2; y++) {
      for (let x = 0; x < WIDTH - 2; x++) {
        const p1 = updatedBoard[x][y];
        const p2 = updatedBoard[x + 1][y + 1];
        const p3 = updatedBoard[x + 2][y + 2];
        if (arePiecesEqual(p1, p2) && arePiecesEqual(p2, p3) && p1?.age === Age.CAT) {
          return p1.color;
        }

        const p4 = updatedBoard[x + 2][y]
        const p5 = updatedBoard[x + 1][y + 1]
        const p6 = updatedBoard[x][y + 2]
        if (arePiecesEqual(p4, p5) && arePiecesEqual(p5, p6) && p4?.age === Age.CAT) {
          return p4.color;
        }
      }
    }
    return null;
  }

  const check_triple_kitty = (updatedBoard: Board): void => {
    // Check rows
    for (let x = 0; x < WIDTH; x++) {
      for (let y = 0; y < HEIGHT - 2; y++) {
        const p1 = updatedBoard[x][y];
        const p2 = updatedBoard[x][y + 1];
        const p3 = updatedBoard[x][y + 2];
        if (arePiecesEqual(p1, p2) && arePiecesEqual(p2, p3) && p1?.age === Age.KITTEN) {
          // TODO: piece math
          updateCatCount(Age.CAT, p1?.color, 3);
          updatedBoard[x][y] = updatedBoard[x][y + 1] = updatedBoard[x][y + 2] = null;
        }
      }
    }

    // Check columns
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH - 2; x++) {
        const p1 = updatedBoard[x][y];
        const p2 = updatedBoard[x + 1][y];
        const p3 = updatedBoard[x + 2][y];
        if (arePiecesEqual(p1, p2) && arePiecesEqual(p2, p3) && p1?.age === Age.KITTEN) {
          updateCatCount(Age.CAT, p1?.color, 3);
          updatedBoard[x][y] = updatedBoard[x + 1][y] = updatedBoard[x + 2][y] = null;
        }
      }
    }

    // Check diagonals
    for (let y = 0; y < HEIGHT - 2; y++) {
      for (let x = 0; x < WIDTH - 2; x++) {
        const p1 = updatedBoard[x][y];
        const p2 = updatedBoard[x + 1][y + 1];
        const p3 = updatedBoard[x + 2][y + 2];
        if (arePiecesEqual(p1, p2) && arePiecesEqual(p2, p3) && p1?.age === Age.KITTEN) {
          updateCatCount(Age.CAT, p1?.color, 3);
          updatedBoard[x][y] = updatedBoard[x + 1][y + 1] = updatedBoard[x + 2][y + 2] = null;
        }

        const p4 = updatedBoard[x + 2][y]
        const p5 = updatedBoard[x + 1][y + 1]
        const p6 = updatedBoard[x][y + 2]
        if (arePiecesEqual(p4, p5) && arePiecesEqual(p5, p6) && p4?.age === Age.KITTEN) {
          updateCatCount(Age.CAT, p4?.color, 3);
          updatedBoard[x + 2][y] = updatedBoard[x + 1][y + 1] = updatedBoard[x][y + 2] = null;
        }
      }
    }
    setBoard(updatedBoard);
  }

  const boop = (piece: Piece): Board => {
    const [x, y] = coord;
    let updatedBoard: Board = board.map(row => [...row]); // Create a copy of the board
    for (const dx of [-1, 0, 1]) {
      for (const dy of [-1, 0, 1]) {
        if (dx === 0 && dy === 0) {
          continue;
        }
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < WIDTH && ny >= 0 && ny < HEIGHT) {
          if (
            updatedBoard[nx][ny]?.age === Age.CAT &&
            piece.age === Age.KITTEN
          ) {
            // Cats can't be booped by kitties
            continue;
          }
          // Check behind the neighbor
          const bx = nx + dx;
          const by = ny + dy;
          if (
            bx < 0 ||
            bx >= WIDTH ||
            by < 0 ||
            by >= HEIGHT
          ) {
            if (updatedBoard[nx][ny] !== null) {
              // Booped off
              updateCatCount(updatedBoard[nx][ny]?.age, updatedBoard[nx][ny]?.color, 1);
              updatedBoard[nx][ny] = null;
            }
          } else if (updatedBoard[bx][by] === null) {
            // Boop the cat backwards
            updatedBoard[bx][by] = updatedBoard[nx][ny]
            updatedBoard[nx][ny] = null
          } else {
            // There's a cat in the way. No booping.
            ;
          }
        }
      }
    }
    updateCatCount(piece.age, piece.color, -1);
    updatedBoard[x][y] = piece;
    return updatedBoard;
  };

  const handleButtonClick = () => {
    const piece = new Piece(currentTurn, ageSwitch);
    let updatedBoard = boop(piece);
    check_triple_kitty(updatedBoard);
    const winning_color = check_winner(updatedBoard);
    if (winning_color !== null) {
      debugger;
      setWinner(winning_color);
    } else {
      setTurnCounter(turnCounter+1);
      if (currentTurn === Color.ORANGE) {
        setCurrentTurn(Color.BROWN)
      } else {
        setCurrentTurn(Color.ORANGE)
      }
    }
  };

  return (
    <div className={`${winner === null ? 'App' : 'blink-bg'}`}>
      <div className="boop-header">
        <div className="boop-gamename">Boop</div>
      </div>
      <GameBoard 
        onChange={handleSquareClick}
        board={board}
      />
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>Kitten</Typography>
        <Switch 
          size="medium"
          onChange={handleAgeSwitchChange}
          checked={ageSwitch === Age.CAT}
        />
        <Typography>Cat</Typography>
      </Stack>
      <Stack direction="row" spacing={5} alignItems="center">
        <div className="cat-counters">
          <div className="cat-counter-header">Orange</div>
          <div>{`Number of Kittens: ${numOrangeKittens}`}</div>
          <div>{`Number of Cats: ${numOrangeCats}`}</div>
        </div>
        <div className="cat-counters">
          <div className="cat-counter-header">Brown</div>
          <div>{`Number of Kittens: ${numBrownKittens}`}</div>
          <div>{`Number of Cats: ${numBrownCats}`}</div>
        </div>
      </Stack>
      <Typography>
        {`Turn number: ${turnCounter}. ${winner === null ? `It is ${colorEnumToStr(currentTurn)} player's turn.` : `${colorEnumToStr(winner)} player has won!`}`}
      </Typography>
      <Button 
        variant="contained"
        onClick={handleButtonClick}
        disabled={coord && board[coord[0]][coord[1]] !== null && winner !== null}
      >
        Submit move
      </Button>

      <div className="bottom-part">
        <Typography>By Willy Nojopranoto</Typography>
        <a href="https://github.com/wnojopra/boop">
          <Button>View on Github</Button>
        </a>
      </div>
    </div>
  );
}

export default App;
