import React,{useState,  useCallback, useEffect} from 'react';
import { FormChooser } from "../../TestPlansManager/FormChooser";
import { Card, Typography, Divider, Dialog, DialogContent } from "@material-ui/core";
import api from '../../../../apiService';
import TableSummaries from '../../Summaries/TableSummaries';
import {  createHeadersFromForm } from './TestHeaders';
import { Question } from '../../../Tests/Form/Quiz/Question/Question';


export const TestsPoolMain = () =>  {
    const [tests,setTests] = useState({rows:[], headers:[]});
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionModalOpen, setQuestionModalOpen] = useState(false);
    const [experiments,setExperiments] = useState([]);

    const fetchExperiments = useCallback(async() => {
        const experiments = await api.getExperiments();
        setExperiments(experiments.data.map(exp => exp.id));
      },[]);

    const fetchTests = useCallback(async(expName, form) => {
        const res = await api.getExperimentTests(expName,form.name);
        let questions=[];
        if(form.isFillAnswers){
            questions = await fetchQuestions(expName)
        }

        setTests({rows:res.data, headers: createHeadersFromForm(
            form,
            expName,
            (qid) => {
                const question= questions.find(question => question.id === qid);
                setCurrentQuestion(question.data);
                setQuestionModalOpen(true);
             })});
    },[]);

    const fetchQuestions = useCallback(async(expName) => {
        const res = await api.getQuestions(expName);
        return res.data;
    },[]);
  
    useEffect(() => {
        fetchExperiments();
    },[fetchExperiments]);

    return (
        <Card style={{padding:'20px'}}>
            <Typography variant="h5" >
                Test Pool 
            </Typography>
            <Divider/>
            <div style={{width: '400px' }}>
                <FormChooser 
                    dontRefresh 
                    alreadyDone
                    experiments={experiments} 
                    onSelectForm={(expName,form) => {
                        console.log(expName,form.name)  
                        fetchTests(expName,form);
                }}/>
            </div>
        <div style={{marginTop:'50px'}}>
                  {tests.rows.length > 0 && <TableSummaries 
                    rows={tests.rows}
                    initPageSize={10}
                    headers={tests.headers}
                />}
            </div>
        <Dialog open={questionModalOpen} onClose={() => setQuestionModalOpen(false)}>
            <Question question={currentQuestion}/>
        </Dialog>
        </Card>
    );
}