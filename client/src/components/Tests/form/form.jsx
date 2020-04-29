  
import React, {useState, useMemo, useCallback, useEffect} from 'react';
import { QuizViewer } from '../../Viewers/quizViewer/quizViewer';
import { Quiz } from './quiz/quiz';
import { Card, Container, Button } from '@material-ui/core';
import { RankSentences } from '../../Viewers/RankViewer/RankViewer';

export function Form({
    form,
    experimentName,
    onFinish,
}) {
    const [step,setStep] = useState(0);
    const [answers,setAnswers] = useState();
    const [rankSentences,setRankSentences] = useState(form.isRankSentences && addWeight(form.base_sentences_table));


    useEffect(() => {
        setStep(0);
        setAnswers(null);
        setRankSentences(form.isRankSentences && addWeight(form.base_sentences_table));
    },[form]);

    const nextStep = useCallback(() => {
        if(step+1 === renderByStage.length)
            onFinish({answers});
        else
            setStep(step+1)
    },[form, rankSentences]);

    const Summary = useCallback(() => {
        return (
        <div style={{width: '800px'}}>
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
    )},[form]);

    const RankSentencesComp = useCallback(() => {
        return (
        <div style={{width: '800px'}}>
            <RankSentences
                rankSentences={rankSentences}
                setRankSentences={setRankSentences}
            />
            <div style={{float:'right'}}>
                <Button onClick={(nextStep)}> Next</Button>
            </div>
        </div>
    )},[form,rankSentences]);

    const renderByStage = useMemo(() => [
        form.isReadSummary && <Summary/>,
        form.isFillAnswers && <Quiz 
            questions={form.questions}
            onFinish={ answers => {
                setAnswers(answers)
                nextStep()
            }}    />,
        form.isRankSentences && <RankSentencesComp/>,

    ].filter(x => x),[form, rankSentences]);

  return (
    <Container>
        <Card style={{ padding:'30px', display:'flex', flexDirection:'column', alignItems:'center'}}>
            {renderByStage[step]}
        </Card>
    </Container>
  );
}


const addWeight = (summary) => summary.map(sent => ({...sent, weight: 0, normalized_weight:0})); 