import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function WelComeDialog(clickTest, clickNewExperiment, clickExperiments) {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog 
        open={open} 
        onClose={handleClose}

        aria-labelledby="form-dialog-title"
        // disableBackdropClick
        disableEscapeKeyDown
        >
        <DialogTitle id="form-dialog-title">Choose Mode</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To continue please choose mode. 
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="permission key"
            type="password"
            fullWidth
          />
         <TextField
            autoFocus
            margin="dense"
            id="experiment"
            label="experiment"
            type="text"
            fullWidth
          />
          <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              margin: '30px 0 10px'
          }}>
            <Button
                    variant="contained"
                    size="large"
                    style={{marginRight: '10px'}}
                    >
                New Experiments
            </Button>
            <Button
                    variant="contained"
                    size="large"
                    style={{marginRight: '10px'}}
                    >
                Experiments
            </Button>
            <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    >
                Tests
            </Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
