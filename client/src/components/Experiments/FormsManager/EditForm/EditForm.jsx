import React,{useState,useEffect, useCallback, useMemo} from 'react';
import { Typography, Grid, Card, TextField, Button, Divider, Select, MenuItem, Checkbox, ListItemText, Input, Switch } from '@material-ui/core';
import { QuizViewer } from '../../../Viewers/quizViewer/quizViewer';
import {
  useParams,
} from "react-router-dom";
import api from '../../../../apiService';
import { Question } from '../../../Tests/form/quiz/question/question';
import { ERROR_STATUS } from '../../../ERRORS';
import { AddQuestion } from '../AddQuestion/AddQuestion';

const emptyForm = {
    name:'',
    questionIds:[],
    isRankSentences: false,
    isFillAnswers: false,
    isReadSummary: false,
    withFixations: false,
    summary: {},
  }

export function EditForm({
    onSave,
    form,
    }){
      const {experimentName} = useParams();
      const [formNameExists,setFormNameExists] = useState(false);
      const [addQuestion,setAddQuestion] = useState(false);
      const [summaryError,setSummaryError] = useState(false);
      const [questions,setQuestions] = useState([]);
      const [question,setQuestion] = useState(null);
      const [formDTO,setFormDTO] = useState(form || emptyForm);
  
      const fetchQuestions = useCallback(async() => {
        const questions = await api.getQuestions(experimentName);
        setQuestions(questions.data);
      },[]);
  
      useEffect(() => {
        fetchQuestions();
      },[]);
  
      useEffect(() => {
        if(form){
          setFormDTO(form)
        }
        else{
          setFormDTO(emptyForm)
        }
      },[form]);
  
      const onClickSave = useCallback( async () => {
        const {isReadSummary, summary} = formDTO;
        let status;
        //verify
        if(isReadSummary && (
            !summary ||
            !summary.name ||
            !summary.type || 
            !summary.filters
          )){
            setSummaryError(true);
            return;
        }
  
        if(!form) {
          const res = await api.addForm({
            ...formDTO,
            experimentName
          }); 
          status = res.status;
        }
  
        if(status === ERROR_STATUS.NAME_NOT_VALID){
          setFormNameExists(true);
        }
        else if(status < 0){
          //TODO add snackbar
        }
        else{
          onSave && onSave();
        }
      },[formDTO]);
  
  
      const SummaryComp = useMemo(() => {
        const {summary,isReadSummary}  = formDTO;
        if(!summary || !isReadSummary)
          return null;
        const {type,name,filters} = summary;
  
        return type && name && filters &&
          <Card style={{margin: "10px 0"}} >
            <QuizViewer 
              experimentName={experimentName}
              type={formDTO.summary.type}
              name={formDTO.summary.name}
              filters={formDTO.summary.filters}
            />
          </Card>
      },[formDTO]);
  
      const QuestionSectionComp = useMemo(() => {
        return formDTO.isFillAnswers && 
          <div style={{marginBottom:'20px'}}>
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
                <ListItemText primary={question.data.question} />
                <Button onClick={(e) => {
                    e.stopPropagation();
                    setQuestion(question.data);
                  }} >
                  Show
                  </Button>
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
        </div>
      },[formDTO,addQuestion]);
  
      const renderSwitch = useCallback((title,field,onChange) => {
        return <div>
            <Typography variant="h6" style={{display: 'inline-block'}}>
              {title}
            </Typography>
            <Switch
              style={{display:'block'}}
              checked={formDTO[field]}
              onChange={() => { 
                setFormDTO({...formDTO, [field]: !formDTO[field]});
                onChange && onChange();
              }}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </div>},
        [formDTO]
      );
  
      return (
        <Grid container spacing={3} style={{width:"100%"}}>
          <Grid item xs={12} sm={6}>
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
                onChange={(e) => {
                  setFormNameExists(false);
                  setFormDTO({...formDTO, name: e.target.value});
                }}
                id="form-name"
                label="Form Name"/>
  
              <div id="questions-section">
                {renderSwitch(
                  'Questions',
                  'isFillAnswers',
                  () => setAddQuestion(false)
                )}
                {QuestionSectionComp}
              </div>
  
              <div id="summary-section">
                {renderSwitch(
                  'Read Summary',
                  'isReadSummary'
                )}
                {summaryError && <div>ERROR</div>}
              </div>
              
              {renderSwitch(
                'Upload Fixations',
                'withFixations',
              )}
              {renderSwitch(
                'Rank Sentances',
                'isRankSentences',
              )}
              
              <Button
                style={{display: 'block' ,marginTop: '10px', float:'right'}}
                variant="contained"
                onClick={onClickSave}>
                {form? 'Save' : 'Create'}
              </Button>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            { question && 
              <div style={{margin:'10px 0'}}>
                <Question question={question} />
              </div>
            }
            {SummaryComp}
          </Grid>
        </Grid> 
    )
  }
  