  
import React, {useState, useEffect} from 'react';
import { QuizViewer } from '../../Viewers/quizViewer/quizViewer';
import { Quiz } from './QuizView/Quiz';
import { Card, Container, Button, Typography, Paper } from '@material-ui/core';
import { RankSentences } from '../../Viewers/RankViewer/RankViewer';
import { DropzoneArea } from 'material-ui-dropzone';
import {Timer} from './Timer/Timer';
 
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
        const {withTimer, minutes} = form && form.summary;
        const {isReadSummary , isFillAnswers, isRankSentences, withFixations } = form ;
        return (
        <StepPage onClick={nextStep}>
            <Typography variant="h4">New task</Typography>
            <Paper variant="outlined" style={{padding:'10px', marginTop:'10px'}}>
                <Typography >
                    Tasks instructions: <br/><br/> 
                    Your next task includes the following tasks: <br/> 
                    <div style={{marginLeft:'8px'}}>
                        {isReadSummary && <strong>- Reading Summary <br/></strong>}
                        {isRankSentences && <strong>- Read summary and rank sentences<br/></strong>}
                        {isFillAnswers && <strong>- Answering Questions<br/></strong>}
                        {withFixations && <strong>- Upload system fixation files (staff only) <br/></strong>}
                    </div>

                </Typography>
                {isReadSummary && (withTimer || isFillAnswers) &&
                     <Typography style={{marginTop:'10px'}}>
                        Regarding the reading summary task:
                        <ul>
                        {withTimer && <li>
                            You will have <strong>{minutes} minutes </strong> to complete the task, <br/>
                            You can proceed before the times ends. <br/>
                            At the end of the time you will be immediately redirected to the next task.
                        </li>}
                        {isFillAnswers && <li><span>Please read the questions carefully, once you answer a question you will not be able to go back<br/></span></li> }
                        </ul>
                    </Typography>
                }
                {isFillAnswers &&  
                    <Typography style={{marginTop:'10px'}}>
                        Regarding the answering questions mission:<br/>
                        <ul>
                            <li>
                            Please try to answer the right questions in the <strong>shortest</strong> possible time
                            </li>
                        </ul>
                    </Typography>
            }           
            </Paper>
            <Typography style={{marginTop:'10px'}}>
                Click 'NEXT' to start
            </Typography>
        </StepPage>
    )};

    const Summary = () => {
        const {minutes, withTimer} = form && form.summary;

        return (
        <StepPage onClick={() => nextStep()}>
            <QuizViewer
                experimentName={form.experimentName}
                type={form.summary.type}
                name={form.summary.name}
                filters={form.summary.filters}
            />
            {withTimer && <Timer seconds={minutes*60} whenFinished={nextStep}/>}
        </StepPage>
        );
    }

    const UploadFixations = () => (
        <StepPage onClick={() => nextStep()} disabled={!fixations}>
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

const StepPage = ({children, onClick, disabled}) => (
    <div style={{width: '800px'}}>
        {children}
        {onClick && <div style={{float:'right'}}>
            <Button disabled={disabled} id="next-step-form" onClick={onClick}> Next</Button>
        </div>}
    </div>);



