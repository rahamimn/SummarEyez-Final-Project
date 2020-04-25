import React,{useState,useEffect, useCallback} from 'react';
import { Typography, Grid, Card, TextField, Button, Divider, Select, MenuItem, Checkbox, ListItemText, Input, Radio } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { BaseViewer } from '../../Viewers/BaseViewer/BaseViewer';
import { QuizViewer } from '../../Viewers/quizViewer/quizViewer';
import {
  useParams,
} from "react-router-dom";
import api from '../../../apiService';
import { Question } from '../../Tests/form/quiz/question/question';


export function FormsManager({}){
    const {experimentName} = useParams();
    const [selectedForm,setSelectedForm] = useState(null);
    const [question,setQuestion] = useState(null);

    const [forms,setForms] = useState([]);
    const [questions,setQuestions] = useState([]);
    const [formText,setFormText] = useState('');
    const [newForm,setNewForm] = useState(false);
   


    const fetchForms = useCallback(async() => {
      const forms = await api.getForms(experimentName);
      setForms(forms.data);
    },[]);
    const fetchQuestions = useCallback(async() => {
      const questions = await api.getQuestions(experimentName);
      setQuestions(questions.data);
    },[]);
    useEffect(() => {
      fetchForms();
      fetchQuestions();
    },[]);

    return (
        <div style={{ flexGrow: 1}}>
          <Grid container spacing={3} style={{width:"100%"}}>
            <Grid item xs={12} sm={6}>
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
                  onChange={(e,form) => 
                    setSelectedForm(form)
                  }
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
                        setNewForm(!newForm)
                      }}
                     >
                          Upload new Image
                    </Button>}
              </Card>
              { (selectedForm || newForm) && 
                <FormEdit 

                  showQuestion={(question) => {
                    console.log(question);
                    setQuestion(question)
                  }
                  }
                  questions={questions}
                  form={selectedForm}
                  // addQuestionIsShown={addQuestion}
                  // showAddQuestion={() => setAddQuestion(true)}
                  />
              }
            
            </Grid>
            <Grid item xs={12} sm={6}>
              {selectedForm && selectedForm.summary && 
               <Card >
                  <QuizViewer 
                    experimentName={experimentName}
                    type={selectedForm.summary.type}
                    name={selectedForm.summary.name}
                    filters={selectedForm.summary.name}
                  />
               </Card>
              }
              { question && 
                  <Question question={question} />
              }
              
            </Grid>
          </Grid>  
        </div> 
    )
};

function FormEdit({
  onSave,
  onViewSummary,
  questions,
  showQuestion,
  form}){
    const {experimentName} = useParams();
    const [formNameExists,setFormNameExists] = useState(false);
    const [addQuestion,setAddQuestion] = useState(false);
    // const [formName,setFormName] = useState('');
    const [formDTO,setFormDTO] = useState(form || {name:'', questionIds:[]});


    return (
      <Card style={{marginTop: '10px', padding: '20px'}}>
        <Typography variant="h5">
          {form? 'Edit Form' : 'Create Form'}
        </Typography>
        <Divider/>

        <TextField 
          error={formNameExists}
          helperText={formNameExists && "Name already exsits, please choose different name" }
          value={formDTO.name}
          style={{width: '200px',marginTop:'10px', marginBottom: '20px'}}
          onChange={(e) =>setFormDTO({...formDTO, name: e.target.value})}
          id="form-name"
          label="Form Name"/>
        
       
        <Typography variant="h6">
         Quiz
        </Typography>
        <Divider/>
        <Select
          labelId="select-questions"
          id="select-questions"
          multiple
          value={formDTO.questionIds}
          onChange={(event) =>
             setFormDTO({...formDTO, questionIds:event.target.value })
          }
          input={<Input style={{display:'block'}}/>}
          renderValue={(selected) => {
            return questions
            .filter(q => selected.indexOf(q.id) > -1)
            .map( q =>q.data.question)
            .join(', ')
          }}
          // MenuProps={MenuProps}
        >
          {questions.map((question) => (
            <MenuItem key={question.id} value={question.id}>
              <Checkbox checked={formDTO.questionIds.indexOf(question.id) > -1} />
              <ListItemText 
                onClick={(e) => {
                  e.stopPropagation();
                  showQuestion(question.data);
                }} 
                primary={question.data.question} 
              />
            </MenuItem>
          ))}
        </Select>
        {!addQuestion &&
          <Button 
            style={{display: 'block'}}
            color="primary"
            onClick={() => {
              setAddQuestion(true)
            }}
            >
                Add Question
        </Button>}

        { addQuestion && 
              <AddQuestion onAdd={() => {}} />
        }

        <Button
          style={{display: 'block' ,marginTop: '10px', float:'right'}}
          variant="contained"
          onClick={() => {
            
          }}>
          {form? 'Save' : 'Create'}
        </Button>
    </Card>
  )
}

function AddQuestion({
  onAdd,
}){
    const [question,setQuestion] = useState({
      question:'',
      answers:['','','',''],
      correctAnswer:''
    });

    return (
      <Card variant="outlined" style={{marginTop: '10px', marginBottom: '40px', padding: '20px'}}>
        <Typography variant="h5">
          Add Question
        </Typography>
        <Divider/>

        <TextField 
          value={question.question}
          style={{width: '100%',marginTop:'10px', marginBottom: '20px'}}
          onChange={(e) =>setQuestion({...question, question:e.target.value})}
          id="form-name"
          label="Question"/>
        
        {
          question.answers.map((ans,i) => (
            <div style={{display:'flex'}}>
               <Radio
                  checked={question.correctAnswer === `${i}`}
                  onChange={() => setQuestion({...question, correctAnswer:`${i}`})}
                  value={i}
                  inputProps={{ 'aria-label': 'A' }}
                />
              <TextField 
                value={ans}
                style={{ width: '100%' ,marginTop:'10px', marginBottom: '20px'}}
                onChange={(e) =>{
                  const answers = question.answers;
                  answers[i] = e.target.value;
                  setQuestion({...question, answers});
                }}if
                id={`ans-${i}`}
                key={`ans-${i}`}
              label={`Ans #${i}`}/>
            </div>
          ))
         
        }
        
        <Button
          style={{display: 'block' ,marginTop: '10px', float:'right'}}
          variant="contained"
          onClick={() => {
            
          }}>
            Add
        </Button>
    </Card>
  )
}