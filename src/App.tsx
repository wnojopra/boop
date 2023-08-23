import React, { useState } from 'react';
import GameBoard from './GameBoard';
import './App.css';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { Age, Board, Coord, Color, Piece } from './BoopTypes';


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

const App: React.FC = () => {
  const [board, setBoard] = useState<Board>(initBoardState);
  const [coord, setCoord] = useState<Coord>([0, 0]);
  const [ageSwitch, setAgeSwitch] = useState<Age>(Age.KITTEN);
  const [currentTurn, setCurrentTurn] = useState<Color>(Color.ORANGE);
  // const [numOrangeKittens, setNumOrangeKittens] = useState<number>(8)
  // const [numBrownKittens, setNumBrownKittens] = useState<number>(8)
  // const [numOrangeCats, setNumOrangeCats] = useState<number>(0)
  // const [numBrownCats, setNumBrownCats] = useState<number>(0)
  const [turnCounter, setTurnCounter] = useState<number>(1);
  
  const handleSquareClick = (coord: [number, number]) => {
    setCoord(coord);
  };

  const handleAgeSwitchChange = () => {
    setAgeSwitch(ageSwitch === Age.KITTEN ? Age.CAT : Age.KITTEN);
  };

  const handleButtonClick = () => {
    const piece = new Piece(currentTurn, ageSwitch);
    const updatedBoard: Board = board.map(row => [...row]); // Create a copy of the board
    const [x, y] = coord;
    updatedBoard[x][y] = piece;
    setBoard(updatedBoard);
    setTurnCounter(turnCounter+1);
    if (currentTurn === Color.ORANGE) {
      setCurrentTurn(Color.BROWN)
    } else {
      setCurrentTurn(Color.ORANGE)
    }
  };

  return (
    <div className="App">
      <h1>Boop</h1>
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
      <Typography>
        {`Turn number: ${turnCounter}. It is ${currentTurn === Color.ORANGE ? "Orange" : "Brown"} player's turn.`}
      </Typography>
      <Button 
        variant="contained"
        onClick={handleButtonClick}
        disabled={coord && board[coord[0]][coord[1]] !== null}
      >
        Submit move
      </Button>
    </div>
  );
}

export default App;
