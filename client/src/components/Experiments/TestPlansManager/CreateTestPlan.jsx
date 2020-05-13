import React,{useState,useEffect, useCallback} from 'react';
import { Typography, TextField, Button, Paper, IconButton} from '@material-ui/core';
import api from '../../../apiService';
import { ERROR_STATUS } from '../../ERRORS';
import CloseIcon from '@material-ui/icons/Close';
import { FormChooser } from './FormChooser';

export function CreateTestPlan({ setSelectedForm, onCreate, onClose}){

    const [formsDetails,setFormsDetails] = useState([]);
    const [experiments,setExperiments] = useState([]);
    const [testPlanName,setTestPlanName] = useState('');
    const [testPlanNameError,setTestPlanNameError] = useState(null);
    const [addIsOpen,setAddIsOpen] = useState(false);

    const onSelectForm = (experimentName, form) => {
        setAddIsOpen(false);
        setSelectedForm({...form,experimentName});
        setFormsDetails([...formsDetails,{
            experimentName,
            form
        }]);
    }

    const fetchExperiments = useCallback(async() => {
      const experiments = await api.getExperiments();
      setExperiments(experiments.data.map(exp => exp.id));
    },[]);

    useEffect(() => {
        fetchExperiments();
    },[fetchExperiments]);

    const usedExperiments = formsDetails.map(d => d.experimentName);

    const addTestPlan = async () => {
      const {status} = await api.addTestPlans(testPlanName, formsDetails.map(d => ({experimentName:d.experimentName, formId: d.form.name})));
      if(status === ERROR_STATUS.NAME_NOT_VALID)
        setTestPlanNameError(true);
      if(status===0){
        onCreate()
      }
    }
    return (
      <Paper variant="outlined" style={{padding: '15px',width:'fit-content',marginTop:'10px', flexGrow: 1}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <Typography variant="h5">
            Create Test Plan
            </Typography>
            { onClose ? (
                <IconButton aria-label="close" onClick={() => onClose()}>
                    <CloseIcon />
                </IconButton>
                ) : null
            }
          </div>
        <TextField 
          error={testPlanNameError}
          helperText={testPlanNameError && "Name empty, or already exsits" }
          value={testPlanName}
          style={{width: '200px',marginTop:'10px', marginBottom: '20px'}}
          onChange={(e) => {
            setTestPlanNameError(false);
            setTestPlanName(e.target.value);
          }}
          id="test-plan-name"
          label="name"/>
        {formsDetails.map(detail => (
          <Paper style={{padding:'10px', width:'500px', marginTop:'10px', display:'flex'}} variant="outlined">
              <Typography style={{width:'250px', padding:'0 5px'}}>{detail.experimentName}</Typography>
              <Typography>{detail.form.name}</Typography>
          </Paper>)
        )}
        <Paper style={{padding:'15px', width:'500px', marginTop:'10px'}} variant="outlined">
          { addIsOpen ? 
              <FormChooser experiments={experiments.filter(e => !usedExperiments.includes(e))} onSelectForm={onSelectForm} /> :
              <Button onClick={() => setAddIsOpen(true)}>Add Form</Button>
          }
        </Paper>
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button disabled={!testPlanName} style={{marginTop:'10px'}} onClick={addTestPlan}>Create Test Plan</Button>
        </div>
      </Paper>

    )
};