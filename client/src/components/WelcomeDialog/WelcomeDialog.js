import React,{useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  useHistory,
  useParams
} from "react-router-dom";
import api from '../../apiService';

export default function WelcomeDialog({
  onClose,
  permit,
  experimentName
}) {
  const history = useHistory();
  const [permKey,setPermKey] = useState();
  const [experimentText,setExperimentText] = useState();
  const [experiment,setExperiment] = useState();
  const [experiments,setExperiments] = useState();
  const [isKeyError,setKeyError] = useState(false);
  
  useEffect(() => {
    fetchExperiments();
  },[]);

  const fetchExperiments = async () => {
    const res = await api.getExperiments();
    setExperiments(res.data);
  }
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
          <Autocomplete
            id="experiment-select"
            style={{ width: '100%', marginRight:10 }}
            options={experiments}
            autoHighlight
            getOptionLabel={option => option.id}
            renderInput={params => (
              <TextField
                {...params}
                label="Choose an experiment"
                fullWidth
                inputProps={{
                    ...params.inputProps,
                    autoComplete: 'disabled', // disable autocomplete and autofill
                }}
              />
            )}
            onChange={(e,experiment) => 
              setExperiment(experiment)
            }
            onInputChange={(e, value) => 
              setExperimentText(value)
            }
            inputValue={experimentText}

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
                      validate() ? history.push(experimentName ? 
                        `/experiments/${experimentName}/new` :
                        `/experiments-new`
                      ) : setKeyError(true);
                    }}
                    >
                New Experiments
            </Button>
            <Button
                    disabled={!experiment}
                    variant="contained"
                    size="large"
                    style={{marginRight: '10px'}}
                    onClick={() => {
                      onClose && onClose();
                      validate() ? 
                        history.push(`/experiments/${experiment.id}`) :
                        setKeyError(true);
                    }}
                    >
                Go To Experiment
            </Button>
            <Button
                    disabled={true}
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
