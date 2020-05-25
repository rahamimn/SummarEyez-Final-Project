import React, { useEffect, useCallback, useState } from 'react';
import Button from '@material-ui/core/Button';
import { Typography, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import api from '../../apiService';

export default function Tests_TabPanel() {
  const [testPlans,setTestPlans] = useState([]);
  const [selectedTestPlanId,setSelectedTestPlanId] = useState(null);
  const [testPlanText,setTestPlanText] = useState('');

  const fetchTestPlans = useCallback(async() => {
    const res = await api.getTestPlans();
    setTestPlans(res.data);
  },[]);

  useEffect(() => fetchTestPlans(),[fetchTestPlans]);

  return (
    <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between', height:'40vh'}}>
      <div>
        <div>
          <Typography style={{color:'#aaaaaa'}}>You may choose specific test or choose one later</Typography>
        </div>
        <div>
          <Autocomplete
            id="main-test-choose-test-plan"
            style={{ width: '200px', marginRight:10 }}
            options={testPlans}
            autoHighlight
            getOptionLabel={option => option.id}
            onChange={(e,selectedTestPlan) => {
              selectedTestPlan && setSelectedTestPlanId(selectedTestPlan.id);
            }}
            onInputChange={(e, value) => {
              if(e) { 
                setTestPlanText(value);
                setSelectedTestPlanId(null);
              }
            }}
            inputValue={testPlanText || ''}
            renderInput={params => (
              <TextField  
                {...params}
                label="Choose a Test Plan"
                // variant="outlined"
                fullWidth
                inputProps={{
                    ...params.inputProps,
                    autoComplete: 'disabled', // disable autocomplete and autofill
                }}
              />
            )}
          />
        </div>
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
            if(selectedTestPlanId){
              window.open(`/tests/${selectedTestPlanId}`);
            }else{
              window.open('/tests');
            }
          }}
        >
         Conduct Test
            </Button>
      </div>
    </div>
  );
}
