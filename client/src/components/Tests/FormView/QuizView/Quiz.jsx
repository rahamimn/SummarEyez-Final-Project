  
import React, {useState} from 'react';
import { Question } from './QuestionView/Question';

export function Quiz({
    questions,
    onFinish,
}) {

  const [currentQuestion,setCurrentQuestion] = useState(0);
  const [answers,setAnswers] = useState([]);

  const onNext = (ans, time) => {
    const newAnswers = [...answers, {
      id: questions[currentQuestion].id,
      ans,
      time
    }]
    setAnswers(newAnswers);

    if(currentQuestion+1 === questions.length){
        onFinish(newAnswers)
        setCurrentQuestion(0);
    } else {
      setCurrentQuestion(currentQuestion+1);
    }
  }

  return (
    <Question 
        question={questions[currentQuestion]}
        onNext={onNext}
    />
  );
}
