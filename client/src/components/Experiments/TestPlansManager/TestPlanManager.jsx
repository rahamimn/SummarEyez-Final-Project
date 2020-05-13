import React,{useState,useEffect, useCallback} from 'react';
import { Typography, Card, TextField, Button, Divider, Paper} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import api from '../../../apiService';
import { EditForm } from '../FormsManager/EditForm/EditForm';
import { CreateTestPlan } from './CreateTestPlan';

export function TestPlanManager(){
  const [selectedTestPlan,setSelectedTestPlan] = useState(null);
  const [testPlanText,setTestPlanText] = useState('');
  const [testPlans,setTestPlans] = useState([]);
  const [isCreating,setIsCreating] = useState(false);
  const [selectedForm,setSelectedForm] = useState(null);

  const fetchTestPlans = useCallback(async() => {
    const testsPlans = await api.getTestPlans();
    setTestPlans(testsPlans.data);
  },[]);

  useEffect(() => {
    fetchTestPlans();
  },[fetchTestPlans]);
  
  const fetchForm = async (experimentName, formId) => {
    const res = await api.getForm(experimentName, formId, true);
    setSelectedForm({...res.data,experimentName});
  }

  return (
    <div style={{ flexGrow: 1}}>
      <Card style={{padding: '20px'}}>
        <Typography variant="h5" >
          Manage Test Plan 
        </Typography>
        <Divider/>
        <div style={{display:'flex', alignItems:'flex-end', marginTop:'10px'}}>
          <Autocomplete
            disabled={isCreating}
            id="test-manager-choose-test-plan"
            style={{ width: '200px', marginRight:10 }}
            options={testPlans}
            autoHighlight
            getOptionLabel={option => option.id}
            onChange={(e,testPlan) => {
              if(testPlan){
                setSelectedTestPlan(testPlan.data)
                setIsCreating(false);
                setSelectedForm(null);
              }else{
                setSelectedTestPlan(null)
              }
            }}
            onInputChange={(e, value) => setTestPlanText(value)}
            inputValue={testPlanText}
            renderInput={params => (
              <TextField
                {...params}
                label="Choose a test plan"
                fullWidth
                inputProps={{
                    ...params.inputProps,
                    autoComplete: 'disabled', // disable autocomplete and autofill
                }}
              />
            )}
          /> 
          {!isCreating && <Button onClick={() => {
            setIsCreating(true);
            setSelectedTestPlan(null);
            setTestPlanText('');
            }}> Create New Test Plan </Button>}
         </div>
         { selectedTestPlan && !isCreating &&
            <div>
              {selectedTestPlan.forms.map((detail,ind) => (
                <Paper keys={`form-${ind}`} style={{padding:'5px', width:'500px', marginTop:'10px', display:'flex', alignItems:'center'}} variant="outlined">
                  <Typography style={{width:'250px', padding:'0 5px'}}>{detail.experimentName}</Typography>
                  <Button size="small" onClick={() => fetchForm(detail.experimentName, detail.formId )}>{detail.formId}</Button>
                </Paper>)
              )}
          </div>
        }
        {isCreating &&
          <CreateTestPlan
            setSelectedForm={setSelectedForm}
            onClose={() =>  setIsCreating(false)}
            onCreate={async () => {
              setIsCreating(false);
              setSelectedForm(null);
              await fetchTestPlans();
          }}/>
        }
      </Card>
      {(selectedForm) && <EditForm 
        form={selectedForm}
        onSave={() =>{}}
        experimentName={selectedForm.experimentName}
        />
      }
    </div>

  )
};
