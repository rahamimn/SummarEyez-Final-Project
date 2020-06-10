import React, { useState, useEffect, useCallback} from 'react'
import Typography from '@material-ui/core/Typography'
import TableSummaries from './TableSummaries';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import {MainToolbar} from './MainToolbar';
import {
  autoHeaders,
  eyesHeaders,
  mergedHeaders,
  customHeaders
} from './Headers';
import api from '../../../apiService';
import {useParams} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export function Summaries() {
  const {experimentName} = useParams()
  const classes = useStyles();
  const [summaries,setSummaries] = useState({
    auto: [],
    eyes: [],
    custom: [],
    merged: []
  }); 
  const [autoSelected,setAutoSelected] = useState([]); 
  const [eyesSelected,setEyesSelected] = useState([]); 
  const [mergedSelected,setMergedSelected] = useState([]); 
  const [customSelected,setCustomSelected] = useState([]); 

  const formatData = (summaries) => {
    summaries.merged = summaries.merged.map(merged => ({
      ...merged,
      data: {
        ...merged.data,
        numOfOrigins: merged.data.mergedInput.length 
      }
    }));
    return summaries;
  }

  const fetchSummaries = useCallback (async () => {
    const res = await api.getSummaries(experimentName); 
    setSummaries(formatData(res.data));
    setAutoSelected([]);
    setEyesSelected([]);
    setMergedSelected([]);
  },[experimentName]);

  useEffect(() => {
    fetchSummaries();
  }, [fetchSummaries])

  return (
    <div className={classes.root}>
      <MainToolbar 
        updateList = {fetchSummaries}
        selected = {{
          auto: autoSelected,
          eyes: eyesSelected,
          merged: mergedSelected,
          custom: customSelected
        }} />
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="summaries-auto-switch"
        >
          <Typography className={classes.heading}>Automatic Algorithms Summaries</Typography>
        </ExpansionPanelSummary >
        <ExpansionPanelDetails>
          <TableSummaries 
            selected={autoSelected}
            onChangeSelected={setAutoSelected}
            headers={autoHeaders}
            rows={summaries.auto}/>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="summaries-eyes-switch"
        >
          <Typography className={classes.heading}>User-Tests Summaries</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <TableSummaries 
            selected={eyesSelected}
            onChangeSelected={setEyesSelected}
            headers={eyesHeaders}
            rows={summaries.eyes}/>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="summaries-custom-switch"
        >
          <Typography className={classes.heading}>Custom Made Summaries</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <TableSummaries 
            selected={customSelected}
            onChangeSelected={setCustomSelected}
            headers={customHeaders}
            rows={summaries.custom}/>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="summaries-merge-switch"
        >
          <Typography className={classes.heading}>Merged Summaries</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <TableSummaries 
            selected={mergedSelected}
            onChangeSelected={setMergedSelected}
            headers={mergedHeaders}
            rows={summaries.merged}/>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

