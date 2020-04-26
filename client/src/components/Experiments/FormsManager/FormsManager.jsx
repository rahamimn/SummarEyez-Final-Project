import React,{useState,useEffect, useCallback} from 'react';
import { Typography, Card, TextField, Button, Divider} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  useParams,
} from "react-router-dom";
import api from '../../../apiService';
import { EditForm } from './EditForm/EditForm';


export function FormsManager({}){
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
    },[]);

    useEffect(() => {
      if(selectedForm){
        setNewForm(false)
      }
    },[selectedForm]);

    useEffect(() => {
      fetchForms();
    },[]);

    return (
      <div style={{ flexGrow: 1}}>
        <Card style={{padding: '20px'}}>
          <Typography variant="h5">
            Forms Manager
          </Typography>
          <Divider/>
          <Autocomplete
            id="legue-select"
            style={{ width: '200px', marginRight:10 }}
            options={forms}
            autoHighlight
            getOptionLabel={option => option.id}
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
              style={{display: 'block'}}
              color="primary"
              onClick={() => {
                setNewForm(true)
                setFormText('')
                setSelectedForm(null)
              }}
              >
                  Create New Form
            </Button>
          }
        </Card>
        {(newForm || selectedForm) && <EditForm 
          form={selectedForm}
          onSave={() => fetchForms()}
          />
        }
      </div>

    )
};
