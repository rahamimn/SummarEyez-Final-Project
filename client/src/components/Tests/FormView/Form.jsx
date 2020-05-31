  
import React, {useState, useEffect} from 'react';
import { QuizViewer } from '../../Viewers/quizViewer/quizViewer';
import { Quiz } from './QuizView/Quiz';
import { Card, Container, Button, Typography } from '@material-ui/core';
import { RankSentences } from '../../Viewers/RankViewer/RankViewer';
import { DropzoneArea } from 'material-ui-dropzone';

export function Form({
    form,
    onFinish,
}) {
    const [step,setStep] = useState(0);
    const [answers,setAnswers] = useState();
    const [rankSentences,setRankSentences] = useState(form.isRankSentences && addWeight(form.base_sentences_table));
    const [fixations,setFixations] = useState(null);

    useEffect(() => {
        setStep(0);
        setAnswers(null);
        setFixations(null);
        setRankSentences(form.isRankSentences && addWeight(form.base_sentences_table));
    },[form]);

    const StartForm = () => {
        return (
        <StepPage onClick={() => nextStep()}>
            <Typography variant="h4">New Task ahead</Typography>
            <Typography variant="h5">press next to start</Typography>
        </StepPage>
    )};

    const Summary = () => (
        <StepPage onClick={() => nextStep()}>
            <QuizViewer
                experimentName={form.experimentName}
                type={form.summary.type}
                name={form.summary.name}
                filters={form.summary.filters}
            />
        </StepPage>
    )

    const UploadFixations = () => (
        <StepPage onClick={() => nextStep()}>
            <DropzoneArea
                initialFiles={[fixations && URL.createObjectURL(fixations)].filter(f=>f)}
                filesLimit={1}
                onChange={(files) => setFixations(files[0])}
                acceptedFiles={[".csv","text/csv"]}
                dropzoneText={"Upload fixation file here"}
            />
        </StepPage>
    )

    const RankSentencesComp = () => {
        return (
        <StepPage onClick={() => nextStep()}>
            <RankSentences
                rankSentences={rankSentences}
                setRankSentences={setRankSentences}
            />
        </StepPage>
    )};



    const renderByStage = [
        <StartForm/>,
        form.isReadSummary && <Summary/>,
        form.isRankSentences && <RankSentencesComp/>,
        form.isFillAnswers && <Quiz 
            questions={form.questions}
            onFinish={ answers => {
                setAnswers(answers)
                nextStep(answers)
            }}    />,
        form.withFixations && <UploadFixations/>

    ].filter(x => x);
    
    const nextStep = (answersInput) => {
        if(step+1 === renderByStage.length){
            onFinish({
                formId: form.name,
                experimentName: form.experimentName,
                answers: answersInput || answers,
                sentanceWeights:rankSentences,
                buffer: fixations
             });
            }
        else{
            setStep(step+1)
        }
    };

    
  return (
    <Container>
        <Card elevation={4} style={{ padding:'30px', display:'flex', flexDirection:'column', alignItems:'center'}}>
            {renderByStage[step]}
        </Card>
    </Container>
  );
}


const addWeight = (summary) => summary.map(sent => ({...sent, weight: 0, normalized_weight:0})); 

const StepPage = ({children, onClick}) => (
    <div style={{width: '800px'}}>
        {children}
        {onClick && <div style={{float:'right'}}>
            <Button onClick={onClick}> Next</Button>
        </div>}
    </div>);
