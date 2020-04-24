  
import React, {useState} from 'react';
import { QuizViewer } from '../../Viewers/quizViewer/quizViewer';
import { Quiz } from './quiz/quiz';
import { Card, Container, Button } from '@material-ui/core';


const Summary = ({experimentName, type, name, filters, onNext }) => {
    return (
    <div>
        <QuizViewer
            experimentName={experimentName}
            type={type}
            name={name}
            filters={filters}
        />
        <div style={{float:'right'}}>
            <Button onClick={onNext}> Next</Button>
        </div>
    </div>
)}

export function Form({
    form,
    experimentName,
    onFinish,
}) {
    const [stage,setStage] = useState(0);
    const {type, name, filters} = form.summary;
    
    const renderByStage = [
        <Summary
            type={type}
            name={name}
            filters={filters}
            experimentName={experimentName}
            onNext={() => setStage(stage+1)}
        />,
        <Quiz 
            questions={form.questions}
            onFinish={answers => onFinish(answers)}/>  

    ];
  return (
    <Container>
        <Card style={{ padding:'30px', display:'flex', flexDirection:'column', alignItems:'center'}}>
        {renderByStage[stage]}
        </Card>
    </Container>
    
  );
}

