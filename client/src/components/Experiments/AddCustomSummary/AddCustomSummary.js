import React, { useState, useEffect, useCallback} from 'react'
import Typography from '@material-ui/core/Typography'
import api from '../../../apiService';
import {useParams, useHistory} from 'react-router-dom'
import { Card, CircularProgress, Button, Divider, Paper, TextField } from '@material-ui/core';
import { RankSentences } from '../../Viewers/RankViewer/RankViewer';
import { ERROR_STATUS } from '../../ERRORS';


export function AddCustomSummary() {
  const {experimentName} = useParams();

  const [rankSentences,setRankSentences] = useState([])
  const [nameText,setNameText] = useState('');
  const [nameError,setNameError] = useState('');
  const history = useHistory();

  const fetchExperimentInfo = useCallback (async () => {
    const res = await api.getSentencesWeights(experimentName); 
    setRankSentences(res.data.map(sent => ({...sent, weight:0, normalized_weight: 0})));
  },[experimentName]);

  useEffect(() => {
    fetchExperimentInfo();
  }, [fetchExperimentInfo])
    
  
  return (
        <Card style={{padding: '20px', maxWidth:'850px'}}>
            <Typography variant="h5">Add Custom Summary</Typography>
            <Divider/>
            <Paper  variant="outlined" style={{padding:'10px', marginTop:'10px'}}>
                <Typography>
                    Here you may add custom summary to the system.<br/>
                    * just to clarify summary is only set of weights and sentences, the color filters, are set only in the form, after you create one.
                </Typography>
            </Paper>

  
            {rankSentences.length ===0 ? 
                <CircularProgress/> :
                <div>
                    <TextField 
                        error={nameError}
                        helperText={nameError}
                        value={nameText}
                        style={{width: '200px',marginTop:'10px', marginBottom: '20px'}}
                        onChange={(e) => setNameText(e.target.value)}
                        id="add-custom-summary-name-input"
                        label="Summary Name" />
                    <RankSentences
                        rankSentences={rankSentences}
                        setRankSentences={setRankSentences}
                    />
                </div>
                
            }
            <Button 
                disabled={nameText === '' || rankSentences.length === 0}
                onClick={
                    async () =>{
                        const {status} = await api.addCustomSummary(experimentName,nameText,rankSentences);

                        if(status === ERROR_STATUS.NAME_NOT_VALID){
                            setNameError('name error, already exists or wrong characters');
                        }
                        else if(status<0){

                        }
                        else{
                            history.push(`/experiments/${experimentName}/summaries`);
                        }
                    } 
                }>
                Add
            </Button>
        </Card>
  );
}

