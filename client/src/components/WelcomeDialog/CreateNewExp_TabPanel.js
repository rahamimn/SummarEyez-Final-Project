import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {useHistory, useParams} from "react-router-dom";
import { Typography } from '@material-ui/core';
export const PASSWORD = "eyes1234";

export default function ChooseFromExisting_TabPanel({
  onClose,
  permit,
}) {
  const history = useHistory();
  const [permKey, setPermKey] = useState();
  const [isKeyError, setKeyError] = useState(false);
  const {experimentName} = useParams();

  const validate = () => {
    permit(false);
    if (permKey === PASSWORD) {
      permit();
      return true;
    }
    return false;
  }

  return (
    <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between', height:'40vh'}}>
      <div>
        <Typography style={{color:'#aaaaaa'}}>Create new research<br></br>
        The research will contain all related tests and summaries</Typography>
        <br></br>
        {permit && <TextField
          lineHeight='1200px'
          error={isKeyError}
          helperText=""
          autoFocus
          margin="dense"
          id="welcome-dialog-permission-input"
          label="Enter Password"
          value={permKey}
          onChange={(e) => setPermKey(e.target.value)}
          type="password"
          fullWidth
          variant="outlined"
        />}
      </div>
   

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
            (!permit || validate()) ? history.push(experimentName ?
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
