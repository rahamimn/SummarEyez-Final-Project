  
import React, {useState} from 'react';
import { Card, Container, Button, Typography } from '@material-ui/core';
import { ChooseSummary } from './RateSummaries/ChooseSummary';
import { RateSummary } from './RateSummaries/RateSummary';

export function RateSummaries({
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
          <Typography variant="h4">Last Task ahead</Typography>
          <Typography variant="h5">press next to start</Typography>
      </StepPage>
  )};


  const renderByStage = [
    <StartForm/>,
    ...forms.map((form,i) => <RateSummary form={form} onNext={(rate) => {
      const summariesRate = answers.summariesRate;
      summariesRate[i] = {
        formName: form.name,
        experimentName: form.experimentName,
        rate: rate
      };
      setAnswers({
        ...answers,
        summariesRate
      });
      nextStep();
    }}/>),
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
