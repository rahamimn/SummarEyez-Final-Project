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

function MainTests() {
  // const {experimentName} = useParams();
  const [forms,setForms] = useState([]);
  const [currentFormIndex,setCurrentFormIndex] = useState(0);
  const [testId,setTestId] = useState('');
  const [testIdError,setTestIdError] = useState(false);
  const [tests,setTests] = useState([]);
  
  const fetchForm = useCallback(async() => {
    const experimentName = 'Teachers';
    const res1 = await api.getForm(experimentName, 'rank1');
    setForms([{...res1.data, experimentName}]);
  },[]);

  const registeration = () => (
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <div style={{width: '800px' }}>
          <Typography variant="h3"> Register Test </Typography>
          <TextField 
            error={testIdError}
            helperText={testIdError && "id already exsits, please choose different id" }
            value={testId}
            style={{width: '200px',marginTop:'10px', marginBottom: '20px'}}
            onChange={(e) => setTestId(e.target.value)}
            id="text"
            label="Student ID" />
        
          <div>
            <Button  
              disabled={!testId}
              style={{float:'right'}} onClick={fetchForm}
              > Start </Button>
          </div>
        </div>
      </div>
  );


  const onFinish = async ({answers, sentanceWeights, buffer}) => {
    const res = await api.addTest({
      experimentName: 'Teachers',
      formId: 'rank1',
      testId,
      answers,
      sentanceWeights,
      buffer
    });
    if(res.status === ERROR_STATUS.NAME_NOT_VALID){
      setTestIdError(true);
    }
    //handle data
  };

  if(forms.length !== 0){
    return (
    <Form
      form={forms[currentFormIndex]}
      onFinish={onFinish}/>
    )
  }
  else{
    return (
      <Container>
        <Card style={{padding:'30px'}}>
          {forms.length === 0 && registeration()}
        </Card>
      </Container>
    );
  }
}

export default MainTests;