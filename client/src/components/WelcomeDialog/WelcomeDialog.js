import React,{useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  useHistory,
} from "react-router-dom";

export default function WelcomeDialog({
  onClose,
  permit,
}) {
  const history = useHistory();
  const [permKey,setPermKey] = useState();
  const [isKeyError,setKeyError] = useState(false);
  
  const validate = () => {
    permit(false);
    if(permKey === '1234'){
      permit();
      return true;
    }
    return false;
  }


  return (
    <div>
      <Dialog 
        open={true} 
        onClose={onClose}
        aria-labelledby="form-dialog-title"
        disableBackdropClick = {!!!onClose}
        disableEscapeKeyDown = {!!!onClose}
        >
        <DialogTitle id="form-dialog-title">Choose Mode</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To continue please choose mode. 
          </DialogContentText>
          <TextField
            error={isKeyError}
            helperText="Incorrect Key"
            autoFocus
            margin="dense"
            id="password"
            label="permission key"
            value={permKey}
            onChange={(e) => setPermKey(e.target.value)}
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
                    onClick={() => {
                      onClose && onClose();
                      validate() ? history.push('/experiments/new') : setKeyError(true);
                    }}
                    >
                New Experiments
            </Button>
            <Button
                    variant="contained"
                    size="large"
                    style={{marginRight: '10px'}}
                    onClick={() => {
                      onClose && onClose();
                      validate() ? 
                        history.push('/experiments') :
                        setKeyError(true);
                    }}
                    >
                Experiments
            </Button>
            <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => {
                      onClose && onClose();
                      validate();
                      history.push('/tests');
                    }}
                    >
                Tests
            </Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
