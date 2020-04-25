  
import React, {useState, useMemo, useCallback} from 'react';
import { QuizViewer } from '../../Viewers/quizViewer/quizViewer';
import { Quiz } from './quiz/quiz';
import { Card, Container, Button } from '@material-ui/core';

export function Form({
    form,
    experimentName,
    onFinish,
}) {
    const [step,setStep] = useState(0);
    const [answers,setState] = useState();

    const nextStep = useCallback(() => {
        if(step+1 === renderByStage.length)
            onFinish({answers});
        else
            setStep(step+1)
    });

    const Summary = useCallback(() => {
        return (
        <div>
            <QuizViewer
                experimentName={experimentName}
                type={form.summary.type}
                name={form.summary.name}
                filters={form.summary.filters}
            />
            <div style={{float:'right'}}>
                <Button onClick={nextStep}> Next</Button>
            </div>
        </div>
    )});

    const renderByStage = useMemo(() => [
        form.summary && <Summary/>,
        form.questions && <Quiz 
            questions={form.questions}
            onFinish={ answers => {
                setState(answers)
                nextStep()
            }}    />,

    ].filter(x => x));

  return (
    <Container>
        <Card style={{ padding:'30px', display:'flex', flexDirection:'column', alignItems:'center'}}>
        {renderByStage[step]}
        </Card>
    </Container>
    
  );
}

