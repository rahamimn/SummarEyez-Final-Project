import React,{useState, useCallback} from 'react';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  useParams,
} from "react-router-dom";
import api from '../../../apiService';

export function FormChooser({experiments, onSelectForm}){
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
          id="legue-select"
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
          id="legue-select"
          style={{ width: '200px', marginRight:10 }}
          options={forms}
          autoHighlight
          getOptionLabel={option => option.id}
          onChange={(e,form) => {
            setSelectedExperiment(null);
            setExperimentText('');
            setFormText('');
            setForms([]);
            form && onSelectForm(selectedExperiment, form.data);
          }}
          onInputChange={(e, value) => experimentText && setFormText(value)}
          inputValue={formText}
          renderInput={params => (
            <TextField
              {...params}
              label="Choose an image"
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

