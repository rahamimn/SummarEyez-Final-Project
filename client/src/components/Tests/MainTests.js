import React, { useCallback, useEffect, useState } from 'react';
import {
  Switch,
  Route,
  useParams
} from "react-router-dom";
import { Form } from './Form/Form';
import api from '../../apiService';
import { Typography, Button, Container, Card, TextField } from '@material-ui/core';
import { ERROR_STATUS } from '../ERRORS';
import Autocomplete from '@material-ui/lab/Autocomplete';

const Phases = {
  Start: 'start',
  FillTest: 'fillTest',
  Finish: 'finish',
  Success: 'success',
}
function MainTests() {
  // const {experimentName} = useParams();
  const [forms,setForms] = useState([]);
  
  const [testPlans,setTestPlans] = useState([]);
  const [selectedTestPlan,setSelectedTestPlan] = useState(null);
  const [testPlanText,setTestPlanText] = useState('');
  const [currentFormIndex,setCurrentFormIndex] = useState(0);
  const [testId,setTestId] = useState('');
  const [testIdError,setTestIdError] = useState(false);
  const [tests,setTests] = useState([]);

  const [phase, setPhase] = useState(Phases.Start);


  
  const fetchForms = useCallback(async(formsDetails) => {
    const responses = await Promise.all(formsDetails.map(detail => api.getForm(detail.experimentName, detail.formId)));
    setForms(responses.map((res,i) => ({...res.data, experimentName: formsDetails[i].experimentName})));
  },[]);

  const fetchTestPlans = useCallback(async() => {
    const res = await api.getTestPlans();
    setTestPlans(res.data);
  },[]);

  useEffect(() => fetchTestPlans(),[]);

  

  const registeration = () => (
    <Card elevation={4}  style={{ marginTop:'60px',padding:'30px', width:'900px'}} >
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <div style={{width: '800px' }}>
          <Typography variant="h3"> Register Test </Typography>
          <TextField 
            error={testIdError}
            helperText={testIdError && "id already exsits, please choose different id" }
            value={testId}
            style={{width: '200px',marginTop:'10px', marginBottom: '20px'}}
            onChange={(e) => setTestId(e.target.value)}
            id="main-tests-student-id"
            label="Student ID" />

          <Autocomplete
            id="main-test-choose-test-plan"
            style={{ width: '200px', marginRight:10 }}
            options={testPlans}
            autoHighlight
            getOptionLabel={option => option.id}
            onChange={(e,selectedTestPlan) => {
              setSelectedTestPlan(selectedTestPlan.data);
              fetchForms(selectedTestPlan.data.forms);
            }}
            onInputChange={(e, value) => e && setTestPlanText(value)}
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
          <div>
            <Button  
              disabled={!testId || !selectedTestPlan}
              style={{float:'right'}} 
              onClick={() => setPhase(Phases.FillTest)}
              > Start </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  const Submition = () => (
    <Card elevation={4} style={{ marginTop:'60px',padding:'30px', width:'900px'}} >
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <div style={{width: '800px' }}>
          <Typography variant="h3"> Submition </Typography>
          <TextField 
            error={testIdError}
            helperText={testIdError && "id already exsits, please choose different id" }
            value={testId}
            style={{width: '200px',marginTop:'10px', marginBottom: '20px'}}
            onChange={(e) => setTestId(e.target.value)}
            id="main-tests-student-id"
            label="Student ID" />
        
          <div>
            <Button  
              disabled={!testId}
              style={{float:'right'}} 
              onClick={async () => {
                const responses = await Promise.all(tests.map(
                  async testInput => await api.addTest({
                    ...testInput,
                    testPlanId: selectedTestPlan.id
                  }))
                );
                
                if(responses.some(res => res.status === ERROR_STATUS.NAME_NOT_VALID)){
                  setTestIdError(true);
                }
                setTestId('')
                setTestIdError(null)
                setTests([]);
                setCurrentFormIndex(0);
                setPhase(Phases.Success);
              }}
              > Submit </Button>
          </div>
        </div>
      </div>
    </Card>
);

const Success = () => (
  <Card elevation={4} style={{ marginTop:'60px',padding:'30px', width:'900px'}} >
      <div style={{width: '800px' }}>
        <Typography variant="h3"> Test Uploaded Succesfully </Typography>
      </div>
      <div style={{display:'flex', justifyContent:'flex-end'}}>
      <Button  
        onClick={() =>
          setPhase(Phases.Start)
        }
        > Start New </Button>
        </div>
  </Card>
);


  const onFinish = async ({
    answers,
    sentanceWeights,
    buffer,
    experimentName,
    formId}) => {
      const newTests = [...tests,{
        experimentName,
        formId,
        testId,
        answers,
        sentanceWeights,
        buffer
      }];

      setTests(newTests);
      
      if(newTests.length === forms.length) {
        setPhase(Phases.Finish);
        setCurrentFormIndex(0);
      } else {
        setCurrentFormIndex(currentFormIndex + 1);
     }
    };

  return (
    <Container style={{display:'flex', justifyContent:'center'}}>
      {phase === Phases.Start && registeration()}
      {phase === Phases.Finish && Submition()}
      {phase === Phases.Success && Success()}
      {phase === Phases.FillTest &&  
        <Form
          form={forms[currentFormIndex]}
          onFinish={onFinish}/>
      }
  
    </Container>
  );
  
}

export default MainTests;