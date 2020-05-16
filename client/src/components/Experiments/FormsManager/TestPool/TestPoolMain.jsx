import React,{useState,  useCallback, useEffect} from 'react';
import { FormChooser } from "../../TestPlansManager/FormChooser";
import { Card, Typography, Divider } from "@material-ui/core";
import api from '../../../../apiService';
import TableSummaries from '../../Summaries/TableSummaries';
import {  createHeadersFromForm } from './TestHeaders';


export const TestsPoolMain = () =>  {
    const [tests,setTests] = useState({rows:[], headers:[]});
    const [experiments,setExperiments] = useState([]);

    const fetchExperiments = useCallback(async() => {
        const experiments = await api.getExperiments();
        setExperiments(experiments.data.map(exp => exp.id));
      },[]);

    const fetchTests = useCallback(async(expName, form) => {
        const res = await api.getExperimentTests(expName,form.name);
        console.log(res);
        setTests({rows:res.data, headers: createHeadersFromForm(form, expName) });
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
        </Card>
    );
}