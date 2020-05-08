import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {useHistory} from "react-router-dom";
import { Typography } from '@material-ui/core';

export default function ChooseFromExisting_TabPanel({
  onClose,
  permit,
  experimentName
}) {
  const history = useHistory();
  const [permKey, setPermKey] = useState();
  const [isKeyError, setKeyError] = useState(false);

  const validate = () => {
    permit(false);
    if (permKey === '1234') {
      permit();
      return true;
    }
    return false;
  }

  return (
    <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between', height:'40vh'}}>
      <div>
        <Typography style={{color:'#aaaaaa'}}>Create New Research, it will contain all conducted tests and summaries</Typography>
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
      </div>
   

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '30px 0 10px'
      }}>
        <Button
          id="editFwelcome-dialog-new-experiment"
          variant="contained"
          size="large"
          style={{ marginRight: '10px' }}
          onClick={() => {
            onClose && onClose();
            validate() ? history.push(experimentName ?
              `/experiments/${experimentName}/new` :
              `/experiments-new/new`
            ) : setKeyError(true);
          }}
        >
          Create New
            </Button>
      </div>
    </div>
  );
}
