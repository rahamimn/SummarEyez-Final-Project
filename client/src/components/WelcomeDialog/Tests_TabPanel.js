import React, { useEffect, useCallback, useState } from 'react';
import Button from '@material-ui/core/Button';
import { Typography, TextField, Checkbox, RadioGroup, Radio, FormControlLabel } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import api from '../../apiService';

export default function Tests_TabPanel() {
  const [testPlans,setTestPlans] = useState([]);
  const [selectedTestPlanId,setSelectedTestPlanId] = useState(null);
  const [testPlanText,setTestPlanText] = useState('');
  const [option, setOption] = useState('all');

  const fetchTestPlans = useCallback(async() => {
    const res = await api.getTestPlans();
    setTestPlans(res.data);
  },[]);

  useEffect(() => {fetchTestPlans()},[fetchTestPlans]);

  return (
    <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between', height:'40vh', width:'100%'}}>
      <div>
        <div>
          <Typography style={{color:'#aaaaaa'}}>You may choose specific test or choose one later</Typography>
        </div>
        <div>
          <RadioGroup name="gender1" value={option} onChange={(e) => setOption(e.target.value)}>
            <FormControlLabel value="all" control={<Radio />} label="Choose One Later" />
            <FormControlLabel value="one-test" control={<Radio />} label={<div style={{display:'flex', alignItems:'center'}}>
              Choose Test
              <Autocomplete
            disabled={option === 'all'}
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
                label="Choose a Test"
                // variant="outlined"
                fullWidth
                style={{marginBottom:'15px', marginLeft:'10px'}}
                inputProps={{
                    ...params.inputProps,
                    autoComplete: 'disabled', // disable autocomplete and autofill
                }}
              />
            )}
          />
            </div>} />
          </RadioGroup>

    
        </div>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '30px 0 10px'
      }}>
        <Button
          disabled={option ==='one-test' && !selectedTestPlanId}
          id="welcome-dialog-conduct-test"
          variant="contained"
          size="large"
          style={{ marginRight: '10px' }}
          onClick={() => {
            if(option === "one-test"){
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
