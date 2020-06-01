  
import React, {useState} from 'react';
import { Card, Container, Button, Typography } from '@material-ui/core';
import { ChooseSummary } from './RateSummaries/ChooseSummary';

export function RateSummaries({
    onFinish,
    forms
}) {
  const [step,setStep] = useState(0);
  const [answers,setAnswers] = useState({
    summariesRate: {},
    topSummary: {},
    worstSummary: {}
  });

  const nextStep = (answersInput) => {
    if(step+1 === renderByStage.length){
        onFinish(answersInput);
        }
    else{
        setStep(step+1)
    }
  };


  const StartForm = () => {
      return (
      <StepPage onClick={() => nextStep()}>
          <Typography variant="h4">Last Task ahead</Typography>
          <Typography variant="h5">press next to start</Typography>
      </StepPage>
  )};


  const renderByStage = [
    <StartForm/>,
    <ChooseSummary text ="Top Summary?" forms={forms} onNext={form => {
      setAnswers({
        ...answers,
        topSummary:{
            formName: form.name,
            experimentName: form.experimentName,
            summary: form.summary
        }
      });
      nextStep();
    }} />,
    <ChooseSummary text ="Worst Summary?" forms={forms} onNext={form => {
      const tempAnswers = {
        ...answers,
        worstSummary:{
          formName: form.name,
          experimentName: form.experimentName,
          summary: form.summary
        }
      };
      setAnswers(tempAnswers);
      nextStep(tempAnswers);
    }}/>
  ];
    
  return (
    <Container>
        <Card elevation={4} style={{ padding:'30px', display:'flex', flexDirection:'column', alignItems:'center'}}>
           {renderByStage[step]}
        </Card>
    </Container>
  );
}

const StepPage = ({children, onClick}) => (
    <div style={{width: '800px'}}>
        {children}
        {onClick && <div style={{float:'right'}}>
            <Button onClick={onClick}> Next</Button>
        </div>}
    </div>);
