  
import React, {useState} from 'react';
import { Card, Container, Button, Typography } from '@material-ui/core';
import { ChooseSummary } from './RateSummaries/ChooseSummary';
import { RateSummaries } from './RateSummaries/rateSummaries';

export function RateSummariesForm({
    onFinish,
    forms
}) {
  const [step,setStep] = useState(0);
  const [answers,setAnswers] = useState({
    summariesRate: Array(forms.length).fill(null),
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
          <Typography variant="h4">Proceed to the next task</Typography>
          <Typography variant="h5">Click 'NEXT' to start</Typography>
      </StepPage>
  )};


  const renderByStage = [
    <StartForm/>,

    <RateSummaries forms={forms} onNext={summariesRate => {
      setAnswers({
      ...answers,
      summariesRate
      });
      nextStep();
    }}/>,
    <ChooseSummary text ="Which of the following summaries was the MOST helpful?" forms={forms} onNext={form => {
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
    <ChooseSummary text ="Which of the following summaries was the LEAST helpful?" forms={forms} onNext={form => {
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
