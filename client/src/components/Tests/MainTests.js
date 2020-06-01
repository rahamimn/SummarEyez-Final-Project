import React, { useCallback, useEffect, useState } from 'react';
import { Form } from './FormView/Form';
import api from '../../apiService';
import { Typography, Button, Container, Card, TextField, CircularProgress } from '@material-ui/core';
import { ERROR_STATUS } from '../ERRORS';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { RateSummaries } from './RateSummariesForm';

const Phases = {
  Start: 'start',
  FillTest: 'fillTest',
  Finish: 'finish',
  Success: 'success',
  RateSummaries: 'rate' 
}
function MainTests({testPlanId}) {
  const [forms,setForms] = useState([]);
  
  const [testPlans,setTestPlans] = useState([]);
  const [selectedTestPlan,setSelectedTestPlan] = useState(null);
  const [testPlanText,setTestPlanText] = useState(testPlanId || '');
  const [currentFormIndex,setCurrentFormIndex] = useState(0);
  const [testId,setTestId] = useState('');
  const [testIdError,setTestIdError] = useState(false);
  const [tests,setTests] = useState([]);
  const [rateSummariesAnswers,setRateSummariesAnswers] = useState({});
  const [loadingSubmition,setLoadingSubmition] = useState(false);
  const [phase, setPhase] = useState(Phases.Start);


  
  const fetchForms = useCallback(async(formsDetails) => {
    const responses = await Promise.all(formsDetails.map(detail => api.getForm(detail.experimentName, detail.formId)));
    setForms(responses.map((res,i) => ({...res.data, experimentName: formsDetails[i].experimentName})));
  },[]);

  const fetchTestPlans = useCallback(async() => {
    const res = await api.getTestPlans();
    setTestPlans(res.data);
  },[]);

  const updateTestPlan = useCallback(async(selectedTestPlan) => {
    setSelectedTestPlan(selectedTestPlan.data);
    fetchForms(selectedTestPlan.data.forms);
  },[testPlanId,fetchTestPlans]);

  useEffect(() => fetchTestPlans(),[fetchTestPlans]);

  useEffect(() => {
    if(testPlanId && testPlans.length > 0){
      const testPlan = testPlans.find(testPlan => testPlan.id === testPlanId);
      updateTestPlan(testPlan);
    }
  },[testPlanId,fetchTestPlans, testPlans]);

  

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
              selectedTestPlan && updateTestPlan(selectedTestPlan);
            }}
            onInputChange={(e, value) => {
              if(e) { 
                setTestPlanText(value);
                setSelectedTestPlan(null);
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
          <div>
            <Button
              id="main-tests-register"
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
        
          <div style={{display:'flex',justifyContent: ' flex-end'}}>
            {loadingSubmition ? 
              <CircularProgress style={{marginRight:'10px'}}/> :
              <Button  
                id="main-tests-submit"
                disabled={!testId}
                style={{float:'right'}} 
                onClick={async () => {
                  setLoadingSubmition(true);
                  const responses = await Promise.all(tests.map(
                    async testInput => await api.addTest({
                      ...testInput,
                      testPlanId: selectedTestPlan.id
                    })),
                    api.addRateSummaries(testPlanId,testId,rateSummariesAnswers)
                  );
                  setLoadingSubmition(false);
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
            }
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


  const onFinishForms = async ({
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
        setPhase(Phases.RateSummaries);
        setCurrentFormIndex(0);
      } else {
        setCurrentFormIndex(currentFormIndex + 1);
      }
  };

  const onFinishRateSummaries = async (ratingAnswers) => {
    setRateSummariesAnswers(ratingAnswers);
    setPhase(Phases.Finish);
  };

  return (
    <Container style={{display:'flex', justifyContent:'center'}}>
      {phase === Phases.Start && registeration()}
      {phase === Phases.Finish && Submition()}
      {phase === Phases.Success && Success()}
      {phase === Phases.FillTest &&  
        <Form
          form={forms[currentFormIndex]}
          onFinish={onFinishForms}/>
      }
      {phase === Phases.RateSummaries && <RateSummaries forms={forms} onFinish={onFinishRateSummaries}/>}
    </Container>
  );
  
}

export default MainTests;