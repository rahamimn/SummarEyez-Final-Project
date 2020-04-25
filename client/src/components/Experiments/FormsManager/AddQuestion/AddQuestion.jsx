

import React,{useState} from 'react';
import { Typography, Card, TextField, Button, Divider, Radio } from '@material-ui/core';
import {
  useParams,
} from "react-router-dom";
import api from '../../../../apiService';
import { ERROR_STATUS } from '../../../ERRORS';


export function AddQuestion({
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
              //TODO
            }}>
              Add
          </Button>
      </Card>
    )
  }
  
  