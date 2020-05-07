import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useHistory } from "react-router-dom";
import api from '../../apiService';

export default function ChooseFromExisting_TabPanel({
  onClose,
  permit,
}) {
  const history = useHistory();
  const [permKey, setPermKey] = useState();
  const [experimentText, setExperimentText] = useState();
  const [experiment, setExperiment] = useState();
  const [experiments, setExperiments] = useState();
  const [isKeyError, setKeyError] = useState(false);

  useEffect(() => {
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    const res = await api.getExperiments();
    setExperiments(res.data);
  }
  const validate = () => {
    permit(false);
    if (permKey === '1234') {
      permit();
      return true;
    }
    return false;
  }


  return (
    <div>

      <Autocomplete
        id="experiment-select"
        style={{ width: '100%', marginRight: 10 }}
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
        onChange={(e, experiment) =>
          setExperiment(experiment)
        }
        onInputChange={(e, value) =>
          setExperimentText(value)
        }
        inputValue={experimentText}

      />

      <TextField
        error={isKeyError}
        helperText=""
        autoFocus
        margin="dense"
        id="welcome-dialog-permission-input"
        label="Enter Permission key"
        value={permKey}
        onChange={(e) => setPermKey(e.target.value)}
        type="password"
        fullWidth
      />

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '30px 0 10px'
      }}>

        <Button
          disabled={!experiment}
          variant="contained"
          size="large"
          style={{ marginRight: '10px' }}
          onClick={() => {
            onClose && onClose();
            validate() ?
              history.push(`/experiments/${experiment.id}`) :
              setKeyError(true);
          }}
        >
          Go To Experiment
            </Button>

      </div>
    </div>
  );
}
