import React,{useState,useEffect, useCallback} from 'react';
import { Typography, TextField, Button, Paper, IconButton, Checkbox} from '@material-ui/core';
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
    const [withRateSummaries,setWithRateSummaries] = useState(true);

    const onSelectForm = (experimentName, form) => {
        setAddIsOpen(false);
        setSelectedForm({...form,experimentName});
        setFormsDetails([...formsDetails,{
            experimentName,
            form
        }]);
    }

    const fetchExperiments = useCallback(async() => {
      const {data,status} = await api.getExperiments();
      if(status === 0){
        setExperiments(data.map(exp => exp.id));
      }
    },[]);

    const fetchForm = async (experimentName, formId) => {
      const {data,status} = await api.getForm(experimentName, formId, true);
      if(status === 0 ){
        setSelectedForm({...data,experimentName});
      }
    }

    useEffect(() => {
        fetchExperiments();
    },[fetchExperiments]);

    const usedExperiments = formsDetails.map(d => d.experimentName);

    const addTestPlan = async () => {
      const {status} = await api.addTestPlans(testPlanName,withRateSummaries, formsDetails.map(d => ({experimentName:d.experimentName, formId: d.form.name})));
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
            Create New Test
            </Typography>
            { onClose ? (
                <IconButton aria-label="close" onClick={() => onClose()}>
                    <CloseIcon />
                </IconButton>
                ) : null
            }
          </div>
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <TextField 
              error={testPlanNameError}
              helperText={testPlanNameError && "Name empty, or already exsits" }
              value={testPlanName}
              style={{width: '200px',marginTop:'10px', marginBottom: '20px'}}
              onChange={(e) => {
                setTestPlanNameError(false);
                setTestPlanName(e.target.value);
              }}
              id="create-test-plan-name"
              label="name"/>
            <div style={{display:'flex', alignItems:'center'}}>
              <Typography> User will rate summaries</Typography>
              <Checkbox id="create-test-plan-checkbox-with-rate" checked={withRateSummaries} onChange={(e) => setWithRateSummaries(!withRateSummaries)}/>
            </div>
          </div>
        {formsDetails.map(detail => (
          <Paper style={{padding:'10px', width:'500px', marginTop:'10px', display:'flex', justifyContent:'space-between', alignItems:'center'}} variant="outlined">
              <div style={{display:'flex'}}>
                <Typography style={{width: '180px'}}>{detail.experimentName}</Typography>
                <Typography style={{cursor: 'pointer'}} onClick={() => {
                  fetchForm(detail.experimentName, detail.form.name)
                } 
                  }>{detail.form.name}</Typography>
              </div>
              <Button onClick={() => { 
                setSelectedForm(null);
                setFormsDetails(formsDetails.filter((d) => !(
                  d.experimentName === detail.experimentName &&
                  d.form === detail.form) ))
              }}>Remove</Button>
          </Paper>)
        )}
        <Paper style={{padding:'15px', width:'500px', marginTop:'10px'}} variant="outlined">
          { addIsOpen ? 
              <FormChooser experiments={experiments.filter(e => !usedExperiments.includes(e))} onSelectForm={onSelectForm} /> :
              <Button id="create-test-plan-add-more" onClick={() => setAddIsOpen(true)}>Add Form</Button>
          }
        </Paper>
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button id="create-test-plan-submit" disabled={!testPlanName} style={{marginTop:'10px'}} onClick={addTestPlan}>Create Test Plan</Button>
        </div>
      </Paper>

    )
};