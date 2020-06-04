import React,{useState,useEffect, useCallback} from 'react';
import { Typography, Card, TextField, Button, Divider, Paper} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  useParams,
} from "react-router-dom";
import api from '../../../apiService';
import { EditForm } from './EditForm/EditForm';


export function FormsManager(){
    const {experimentName} = useParams();
    const [selectedForm,setSelectedForm] = useState(null);
    const [forms,setForms] = useState([]);
    const [newForm,setNewForm] = useState(false);
    const [formText,setFormText] = useState('');

    const fetchForms = useCallback(async() => {
      const forms = await api.getForms(experimentName);
      setForms(forms.data);
      setSelectedForm(null)
      setNewForm(false)
    },[experimentName]);

    useEffect(() => {
      if(selectedForm){
        setNewForm(false)
      }
    },[selectedForm]);

    useEffect(() => {
      fetchForms();
    },[fetchForms]);

    return (
      <div style={{ flexGrow: 1}}>
        <Card style={{padding: '20px'}}>
          <Typography variant="h5">
            Forms Manager
          </Typography>
          <Divider/>
          <Paper  variant="outlined" style={{padding:'10px', marginTop:'10px'}}>
            <Typography style={{color:'#555555'}}>
              If form have not been tested in real life, you can still change it.
            </Typography>
          </Paper>
          <div style={{display:'flex', alignItems:'flex-end', marginTop:'10px'}}>
           <Autocomplete
            disabled={newForm}
            id="forms-manager-choose-form"
            style={{ width: '200px', marginRight:10 }}
            options={forms}
            autoHighlight
            getOptionLabel={option => option.id}
            renderInput={params => (
              <TextField
                {...params}
                label="Choose existing form"
                // variant="outlined"
                fullWidth
                inputProps={{
                    ...params.inputProps,
                    autoComplete: 'disabled', // disable autocomplete and autofill
                }}
              />
            )}
            onChange={(e,form) => {
              
              setSelectedForm(form && form.data)
            }}
            onInputChange={(e, value) => 
              setFormText(value)
            }
            inputValue={formText}

          />
          {!newForm &&
            <Button 
              id='create-new-form-btn'
              style={{display: 'block'}}
              onClick={() => {
                setNewForm(true)
                setFormText('')
                setSelectedForm(null)
              }}
              >
                  Create New Form
            </Button>
          }
          </div>
        </Card>
        {(newForm || selectedForm) && <EditForm 
          form={selectedForm}
          onSave={() => fetchForms()}
          onClose={newForm && (() => setNewForm(false))}
          experimentName={experimentName}
          />
        }
      </div>

    )
};
