import React, { useState, useEffect} from 'react'
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
  mergedHeaders
} from './Headers';
import api from '../../../apiService';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export function Summaries({
  experimentId
}) {
  const classes = useStyles();
  const [summaries,setSummaries] = useState({
    auto: [],
    eyes: [],
    merged: []
  }); 
  const [autoSelected,setAutoSelected] = useState([]); 
  const [eyesSelected,setEyesSelected] = useState([]); 
  const [mergedSelected,setMergedSelected] = useState([]); 


  const fetchSummaries = async () => {
    const summaries = await api.getSummaries(); 
    setSummaries(summaries);
  }

  useEffect(() => {
    fetchSummaries();
  }, [experimentId])

  return (
    <div className={classes.root}>
      <MainToolbar 
        updateList = {fetchSummaries}
        selected = {{
          auto: autoSelected,
          eyes: eyesSelected,
          merged: mergedSelected
        }} />
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Automatic Summaries</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <TableSummaries 
            onChangeSelected={setAutoSelected}
            headers={autoHeaders}
            rows={summaries.auto}/>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>Tests Summaries</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <TableSummaries 
            onChangeSelected={setEyesSelected}
            headers={eyesHeaders}
            rows={summaries.eyes}/>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>Merged Summaries</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <TableSummaries 
            onChangeSelected={setMergedSelected}
            headers={mergedHeaders}
            rows={summaries.merged}/>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

