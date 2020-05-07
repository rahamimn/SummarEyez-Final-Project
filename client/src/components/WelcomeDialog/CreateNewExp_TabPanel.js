import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {useHistory} from "react-router-dom";
import api from '../../apiService';

export default function ChooseFromExisting_TabPanel({
  onClose,
  permit,
  experimentName
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
          id="welcome-dialog-new-experiment"
          variant="contained"
          size="large"
          style={{ marginRight: '10px' }}
          onClick={() => {
            onClose && onClose();
            validate() ? history.push(experimentName ?
              `/experiments/${experimentName}/new` :
              `/experiments-new`
            ) : setKeyError(true);
          }}
        >
          Create New Experiment
            </Button>
      </div>
    </div>
  );
}
