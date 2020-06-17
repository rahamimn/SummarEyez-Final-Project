import React,{useState, useCallback} from 'react';
import { TextField, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import api from '../../../apiService';

export function FormChooser({experiments, onSelectForm, withoutButton, alreadyDone, withManually}){
    const [selectedExperiment,setSelectedExperiment] = useState(null);
    const [selectedForm,setSelectedForm] = useState(null);
    const [forms,setForms] = useState([]);

    const [formText,setFormText] = useState('');
    const [experimentText,setExperimentText] = useState('');

    const fetchForms = useCallback(async(selectedExperiment) => {
      const forms = await api.getForms(selectedExperiment);
      setForms(forms.data.filter(form => 
        (withManually || form.id !== 'Manually') &&
        (!alreadyDone || !form.data.editable)
      ));
    },[]);

    return (
      <div style={{ display: 'flex', flexGrow: 1, alignItems:'flex-end'}}>       
        <Autocomplete
          id="form-chooser-choose-experiment"
          style={{ width: '200px', marginRight:10 }}
          options={experiments}
          autoHighlight
          getOptionLabel={option => option}
          onChange={(e,experiment) => {
            if(experiment){
              setSelectedExperiment(experiment)
              fetchForms(experiment)
            }else{
              setSelectedExperiment(null)
              setForms([])
              setFormText('')
            }
          }}
          onInputChange={(e, value) => setExperimentText(value)}
          inputValue={experimentText}
          renderInput={params => (
            <TextField
              {...params}
              label="Choose an experiments"
              fullWidth
              inputProps={{
                  ...params.inputProps,
  
                  autoComplete: 'disabled', // disable autocomplete and autofill
              }}
            />
          )}
        />

        <Autocomplete
          id="form-chooser-choose-form"
          style={{ width: '200px', marginRight:10 }}
          options={forms}
          autoHighlight
          getOptionLabel={option => option.id}
          onChange={(e,form) => {
            withoutButton ?
              form && onSelectForm(selectedExperiment, form.data):
              setSelectedForm(form && form.data) 
             
          }}
          onInputChange={(e, value) => experimentText && setFormText(value)}
          inputValue={formText}
          renderInput={params => (
            <TextField
              {...params}
              label="Choose a form"
              // variant="outlined"
              fullWidth
              inputProps={{
                ...params.inputProps,
                autoComplete: 'disabled', // disable autocomplete and autofill
              }}
            />
          )}/>
          {!withoutButton &&
            <Button 
              id="form-chooser-ok"
              disabled={!selectedForm || !selectedExperiment}
              onClick={() =>{
      
                onSelectForm(selectedExperiment, selectedForm)
                if(!withoutButton){
                  setSelectedExperiment(null);
                  setExperimentText('');
                  setFormText('');
                  setForms([]);
                }
              }}>
              OK
            </Button>
          }
      </div>

    )
};

