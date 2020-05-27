import React,{useState, useCallback} from 'react';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import api from '../../../apiService';

export function FormChooser({experiments, onSelectForm, dontRefresh, alreadyDone}){
    const [selectedExperiment,setSelectedExperiment] = useState(null);
    const [forms,setForms] = useState([]);

    const [formText,setFormText] = useState('');
    const [experimentText,setExperimentText] = useState('');

    const fetchForms = useCallback(async(selectedExperiment) => {
      const forms = await api.getForms(selectedExperiment);
      setForms(forms.data);
    },[]);

    return (
      <div style={{ display: 'flex', justifyContent:'space-between', flexGrow: 1}}>       
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
          options={alreadyDone ? forms.filter(form => !form.data.editable): forms}
          autoHighlight
          getOptionLabel={option => option.id}
          onChange={(e,form) => {
            if(!dontRefresh){
              setSelectedExperiment(null);
              setExperimentText('');
              setFormText('');
              setForms([]);
            }
            form && onSelectForm(selectedExperiment, form.data);
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
      </div>

    )
};

