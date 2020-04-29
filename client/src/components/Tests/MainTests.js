import React, { useCallback, useEffect, useState } from 'react';
import {
  Switch,
  Route,
  useParams
} from "react-router-dom";
import { Form } from './form/form';
import api from '../../apiService';

function MainTests() {
  // const {experimentName} = useParams();
  const [form,setForm] = useState(formMock)
  const fetchForm = useCallback(async() => {
    const res = await api.getForm('Teachers','shelly');
    setForm(res.data);
  })
  useEffect(() => fetchForm(),[])
  return (
    <div>
      <Form
        form={form}
        experimentName={'Teachers'} 
        onFinish={() => {}}
        />
    </div>
  );
}

export default MainTests;
  


const questions = [
  {
    id: 'id1',
    question:'This is a dummy question1', 
    answers: ['answer1','answer2','answer3','answer4'],
    currectAnswer: 0
},
{
  id: 'id2',
  question:'This is a dummy question2', 
  answers: ['answer1','answer2','answer3','answer4'],
  currectAnswer: 2
},
{
  id: 'id3',
  question:'This is a dummy question3', 
  answers: ['answer1','answer2','answer3','answer4'],
  currectAnswer: 2
},
{
  id: 'id4',
  question:'This is a dummy question4', 
  answers: ['answer1','answer2','answer3','answer4'],
  currectAnswer: 2
},
{
  id: 'id5',
  question:'This is a dummy question 5', 
  answers: ['answer1','answer2','answer3','answer4'],
  currectAnswer: 2
},
]

const formMock = {
  questions,
  isFillAnswers: true,
  isReadSummary: true,
  summary:{type: 'auto', name:'auto1.py', filters:{ 
    color: {size:'3',palete: 'op_1'},
    isGradient:true,
    minWeight:0,
    topSentencesCount:0
  }}
}