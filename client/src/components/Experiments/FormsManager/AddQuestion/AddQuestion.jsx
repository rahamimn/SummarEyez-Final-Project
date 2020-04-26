

import React,{useState, useMemo} from 'react';
import { Typography, Card, TextField, Button, Divider, Radio, IconButton } from '@material-ui/core';
import {
  useParams,
} from "react-router-dom";
import api from '../../../../apiService';
import { ERROR_STATUS } from '../../../ERRORS';
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
                    setQuestion({...question, answers: [...answers]});
                  }}if
                  id={`ans-${i}`}
                  key={`ans-${i}`}
                label={`Ans #${i}`}/>
              </div>
            )) 
          }
          
          <Button
            disabled={disabled}
            style={{display: 'block' ,marginTop: '10px', float:'right'}}
            variant="contained"
            onClick={async () => {
                const {status, data} = await api.addQuestion(experimentName,question)
                //TODO handle errors
                onAdd && onAdd(data.id);
            }}>
              Add
          </Button>
      </Card>
    )
  }
  
  