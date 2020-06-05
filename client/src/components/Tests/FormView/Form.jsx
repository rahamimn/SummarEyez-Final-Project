  
import React, {useState, useEffect} from 'react';
import { QuizViewer } from '../../Viewers/quizViewer/quizViewer';
import { Quiz } from './QuizView/Quiz';
import { Card, Container, Button, Typography, Paper } from '@material-ui/core';
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
    const [withTimeout,setWithTimeout] = useState(false);

    if(step === 1 && withTimeout){

        const {minutes} = form && form.summary;
        setWithTimeout(false);
        setTimeout(() => {
            nextStep();
            setWithTimeout(false);
        } , minutes * 60 * 1000);
    }

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
        <StepPage onClick={nextStartTime}>
            <Typography variant="h4">New Task ahead</Typography>
            <Paper variant="outlined" style={{padding:'10px', marginTop:'10px'}}>
                <Typography >
                    Some Instruction: <br/><br/> 
                    Your next task includes the following missions: <br/> 
                    <div style={{marginLeft:'8px'}}>
                        {isReadSummary && <strong>- Reading Summary <br/></strong>}
                        {isRankSentences && <strong>- Read a Summary and rank sentences weights<br/></strong>}
                        {isFillAnswers && <strong>- Answer Questions<br/></strong>}
                        {withFixations && <strong>- Upload System fixation files (for stuff) <br/></strong>}
                    </div>

                </Typography>
                {isReadSummary && (withTimer || isFillAnswers) &&
                     <Typography style={{marginTop:'10px'}}>
                        regarding the Reading Summary mission:
                        <ul>
                        {withTimer && <li>
                            For that you would have <strong>{minutes} minutes </strong>, <br/>
                            you can proceed before the times ends. <br/>
                            in any case after the time ends you will be start immediately the next mission.
                        </li>}
                        {isFillAnswers && <li><span>Please read carfully you would be asking about that text. (you will not have the option to go back) <br/></span></li> }
                        </ul>
                    </Typography>
                }
                {isFillAnswers &&  
                    <Typography style={{marginTop:'10px'}}>
                        regarding the Answer Questions mission:<br/>
                        <ul>
                            <li>
                                please answer as soon as possible.
                            </li>
                        </ul>
                    </Typography>
            }           
            </Paper>
            <Typography style={{marginTop:'10px'}}>
                press next to start
            </Typography>
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
    
        const nextStartTime = () => {
            const {withTimer} = form && form.summary;
            nextStep();
            withTimer && setWithTimeout(true);
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
