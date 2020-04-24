  
import React, {useState, useMemo} from 'react';
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
    const [step,setStep] = useState(0);
    const renderByStage = useMemo(() => [
        form.summary && <Summary
            type={form.summary.type}
            name={form.summary.name}
            filters={form.summary.filters}
            experimentName={experimentName}
            onNext={nextStep}
        />,
        form.questions && <Quiz 
            questions={form.questions}
            onFinish={nextStep}/>  
    ].filter(x => x));

    const nextStep = () => {
        if(step+1 === renderByStage.length)
            onFinish();
        else
            setStep(step+1)
    }

  return (
    <Container>
        <Card style={{ padding:'30px', display:'flex', flexDirection:'column', alignItems:'center'}}>
        {renderByStage[step]}
        </Card>
    </Container>
    
  );
}

