  
import React, {useState, useMemo, useCallback, useEffect} from 'react';
import { QuizViewer } from '../../Viewers/quizViewer/quizViewer';
import { Quiz } from './Quiz/Quiz';
import { Card, Container, Button } from '@material-ui/core';
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

    const nextStep = useCallback((answersInput) => {
        if(step+1 === renderByStage.length){
            onFinish({
                answers: answersInput || answers,
                sentanceWeights:rankSentences,
                buffer: fixations
             });
            }
        else{
            setStep(step+1)
        }
    },[answers,rankSentences, fixations, step]);

    const Summary = useCallback(() => {
        return (
        <StepPage onClick={nextStep}>
            <QuizViewer
                experimentName={form.experimentName}
                type={form.summary.type}
                name={form.summary.name}
                filters={form.summary.filters}
            />
        </StepPage>
    )},[form, step, answers]);

    const uploadArea = useMemo(() => {
        return  },[form, step])

    const UploadFixations = useCallback(() => {
        return (
        <StepPage onClick={nextStep}>
            <DropzoneArea
                initialFiles={[fixations && URL.createObjectURL(fixations)].filter(f=>f)}
                filesLimit={1}
                onChange={(files) => setFixations(files[0])}
                acceptedFiles={[".csv","text/csv"]}
                dropzoneText={"Upload fixation file here"}
            />
        </StepPage>
    )},[form, step, fixations]);

    const RankSentencesComp = useCallback(() => {
        return (
        <StepPage onClick={nextStep}>
            <RankSentences
                rankSentences={rankSentences}
                setRankSentences={setRankSentences}
            />
        </StepPage>
    )},[form,rankSentences, step]);


    const renderByStage = useMemo(() => [
        form.isReadSummary && <Summary/>,
        form.isFillAnswers && <Quiz 
            questions={form.questions}
            onFinish={ answers => {
                setAnswers(answers)
                nextStep(answers)
            }}    />,
        form.isRankSentences && <RankSentencesComp/>,
        form.withFixations && <UploadFixations/>
    ].filter(x => x),[form, rankSentences, step, fixations, answers]);

  return (
    <Container>
        <Card style={{ padding:'30px', display:'flex', flexDirection:'column', alignItems:'center'}}>
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
