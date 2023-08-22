import React, { useState } from 'react';
import GameBoard from './GameBoard';
import './App.css';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';


const label = { inputProps: { 'aria-label': 'KittenOrCat' } };

const App: React.FC = () => {
  const [coord, setCoord] = useState([0, 0]);
  const handleSquareClick = (coord: [number, number]) => {
    setCoord(coord)
  };

  return (
    <div className="App">
      <h1>Boop</h1>
      <GameBoard 
        onChange={handleSquareClick}
      />
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>Kitten</Typography>
        <Switch {...label} size="medium"/>
        <Typography>Cat</Typography>
      </Stack>
      {coord.join(',')}
      <Button variant="contained">
        Submit move
      </Button>
    </div>
  );
}

export default App;
