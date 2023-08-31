import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@mui/material'; 
import { useTheme } from '@mui/material/styles';

export default function ResponsiveDialog() {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        View rules
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Boop rules"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Place a kitten on the board. Placed kittens will boop away adjacent kittens. Kittens may be booped off the board. 
          </DialogContentText>
          <DialogContentText>
            Connect three kittens together to graduate them to cats. Cats cannot be booped by kittens. Cats can boop other cats.
          </DialogContentText>
          <DialogContentText>
            Connect three cats to win!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}