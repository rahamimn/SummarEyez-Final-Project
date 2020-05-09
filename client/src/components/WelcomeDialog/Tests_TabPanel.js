import React from 'react';
import Button from '@material-ui/core/Button';
import {useHistory} from "react-router-dom";
import { Typography } from '@material-ui/core';

export default function Tests_TabPanel({
  onClose,
}) {
  const history = useHistory();

  return (
    <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between', height:'40vh'}}>
      <div>
        <Typography style={{color:'#aaaaaa'}}>Conduct Test</Typography>
      </div>
   

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '30px 0 10px'
      }}>
        <Button
          id="welcome-dialog-conduct-test"
          variant="contained"
          size="large"
          style={{ marginRight: '10px' }}
          onClick={() => {
            window.open('/tests');
          }}
        >
         Conduct Test
            </Button>
      </div>
    </div>
  );
}
