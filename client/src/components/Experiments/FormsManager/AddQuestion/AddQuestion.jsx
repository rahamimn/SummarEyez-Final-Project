

import React,{useState, useMemo} from 'react';
import { Typography, Card, TextField, Button, Divider, Radio, IconButton } from '@material-ui/core';
import {
  useParams,
} from "react-router-dom";
import api from '../../../../apiService';
import CloseIcon from '@material-ui/icons/Close';


export function AddQuestion({
    onAdd,
    onClose,
  }){
    const {experimentName} = useParams();
      const [question,setQuestion] = useState({
        question:'',
        answers:['','','',''],
        correctAnswer:''
      });

      const disabled = useMemo(() => !question.question || question.answers.some(x => !x) || !question.correctAnswer,[question]);
      return (
        <Card variant="outlined" style={{marginTop: '10px', marginBottom: '40px', padding: '20px'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}><Typography variant="h5">
            Add Question
          </Typography>
          {onClose ? (
            <IconButton aria-label="close" onClick={() => onClose()}>
                <CloseIcon />
            </IconButton>
            ) : null
        }
          </div>
          <Divider/>
  
          <TextField 
            value={question.question}
            style={{width: '100%',marginTop:'10px', marginBottom: '20px'}}
            onChange={(e) => setQuestion({...question, question:e.target.value})}
            id="add-question-question"
            label="Question"/>
          
          {
            question.answers.map((ans,i) => {
              const index = i+1;
              return (
              <div style={{display:'flex'}}>
                 <Radio
                    checked={question.correctAnswer === `${index}`}
                    onChange={() => setQuestion({...question, correctAnswer:`${index}`})}
                    value={index}
                    inputProps={{ 'aria-label': 'A' ,id:`add-question-ans-radio-${index}`}}
                  />
                <TextField 
                  value={ans}
                  style={{ width: '100%' ,marginTop:'10px', marginBottom: '20px'}}
                  onChange={(e) =>{
                    const answers = question.answers;
                    answers[i] = e.target.value;
                    setQuestion({...question, answers: [...answers]});
                  }}
                  id={`add-question-ans-${index}`}
                  key={`ans-${index}`}
                label={`Ans #${index}`}/>
              </div>
            )
          }) 
          }
          
          <Button
            disabled={disabled}
            id="add-question-create"
            style={{display: 'block' ,marginTop: '10px', float:'right'}}
            variant="contained"
            onClick={async () => {
                const {data, status} = await api.addQuestion(experimentName,question)
                
                if(status === 0 ){
                  onAdd && onAdd(data.id);
                }
            }}>
              Add
          </Button>
      </Card>
    )
  }
  
  