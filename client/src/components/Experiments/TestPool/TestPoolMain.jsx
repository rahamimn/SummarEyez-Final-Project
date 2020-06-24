import React,{useState,  useCallback, useEffect} from 'react';
import { FormChooser } from "../TestPlansManager/FormChooser";
import { Card, Typography, Divider, Dialog, TextField, Button, Snackbar } from "@material-ui/core";
import api from '../../../apiService';
import TableSummaries from '../Summaries/TableSummaries';
import {  createHeadersFromForm } from './TestHeaders';
import { Question } from '../../Tests/FormView/QuizView/QuestionView/Question';
import {saveAs} from 'save-as';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Alert from '@material-ui/lab/Alert';
import { ERROR_STATUS } from '../../ERRORS';

export const TestsPoolMain = () =>  {
    const [tests,setTests] = useState({rows:[], headers:[]});
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionModalOpen, setQuestionModalOpen] = useState(false);
    const [experiments,setExperiments] = useState([]);
    const [selectedTestPlan,setSelectedTestPlan] = useState(null);
    const [testPlanText,setTestPlanText] = useState('');
    const [testPlans,setTestPlans] = useState([]);
    const [alertError,setAlertError] = useState(null);


    const fetchExperiments = useCallback(async() => {
        const {data,status} = await api.getExperiments();
        if(status === 0){
            setExperiments(data.map(exp => exp.id));
        }
    },[]);

    const fetchTestPlans = useCallback(async() => {
        const {data, status} = await api.getTestPlans();
        if(status === 0){
            setTestPlans(data);
        }
    },[]);
    
      useEffect(() => {
        fetchTestPlans();
        fetchTestPlans();
      },[fetchTestPlans,fetchTestPlans]);
      
    const fetchTests = useCallback(async(expName, form) => {
        const {data, status} = await api.getExperimentTests(expName,form.name);
        let questions=[];
        if(form.isFillAnswers){
            questions = await fetchQuestions(expName)
        }
        if(status === 0){
            setTests({rows:data, headers: createHeadersFromForm(
                form,
                expName,
                (qid) => {
                    const question= questions.find(question => question.id === qid);
                    setCurrentQuestion(question.data);
                    setQuestionModalOpen(true);
                 },
                (qid, answer) => {
                  const question= questions.find(question => question.id === qid);
                  return parseInt(question.data.correctAnswer) === parseInt(answer.ans);
                },
                 
            )});
        }
    },[]);

    const fetchQuestions = useCallback(async(expName) => {
        const {data, status} = await api.getQuestions(expName);
        if(status === 0){
            return data;
        }
        return []
    },[]);
  
    useEffect(() => {
        fetchExperiments();
    },[fetchExperiments]);

    const exportAnswers = async () => {

        const {file,status, error} = await api.exportAnswersByTestPlanCsv(selectedTestPlan.id);
        if(status === ERROR_STATUS.OBJECT_NOT_EXISTS){
            setAlertError("No tests conducted");
        }
        else if(status < 0){
            setAlertError(`Server Error: ${error}`);
        }
        else{
            saveAs(file, `answers-${selectedTestPlan.id}-${new Date().toISOString()}.csv`);
        }
    }

    return (
      <div>
        <Card style={{padding:'20px'}}>
            <Typography variant="h5" >
                Form Submitted
            </Typography>
            <Divider/>
            <div style={{width: '400px' }}>
                <FormChooser 
                    withoutButton 
                    alreadyDone
                    withManually
                    experiments={experiments} 
                    onSelectForm={(expName,form) => {
                        fetchTests(expName,form);
                }}/>
            </div>
        <div style={{marginTop:'50px'}}>
            {
            tests.rows.length > 0 && (
                <TableSummaries 
                    rows={tests.rows}
                    initPageSize={10}
                    headers={tests.headers}
                />
            )}
        </div>
        </Card>
        <Card style={{marginTop: '20px', padding: '20px'}}>
          <Typography>Export Tests as CSV (forms and ratings)</Typography>
          <div style={{display:'flex', alignItems:'flex-end'}}>
            <Autocomplete
                id="test-manager-choose-test-plan"
                style={{ width: '200px', marginRight:10 }}
                options={testPlans}
                autoHighlight
                getOptionLabel={option => option.id}
                onChange={(e,testPlan) => {
                    if(testPlan){
                        setSelectedTestPlan(testPlan.data)
                    }else{
                        setSelectedTestPlan(null)
                    }
                }}
                onInputChange={(e, value) => setTestPlanText(value)}
                inputValue={testPlanText}
                renderInput={params => (
                <TextField
                    {...params}
                    label="Choose a test plan"
                    fullWidth
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'disabled', // disable autocomplete and autofill
                    }}
                />
                )}
            />
            <Button 
              disabled={!selectedTestPlan}
              onClick={exportAnswers}>
                Export
            </Button>
          </div>
        </Card>
        <Dialog open={questionModalOpen} onClose={() => setQuestionModalOpen(false)}>
            <Question question={currentQuestion}/>
        </Dialog>
        <Snackbar   
            anchorOrigin={{ vertical:'top', horizontal:'center' }}
            open={alertError}
            onClose={() => setAlertError(null)}>
            <Alert elevation={6} variant="filled" onClose={() => setAlertError(null)} severity="error">
                {alertError}
            </Alert> 
        </Snackbar>
        </div>
        
    );
}