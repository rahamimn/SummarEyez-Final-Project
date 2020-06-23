import React,{useState} from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import api from '../../../apiService';
import {useParams} from 'react-router-dom'
import MergeDialog from './MergeSummaries/MergeDialog'
import { stringify } from 'qs'
import {saveAs} from 'save-as';
import { CircularProgress } from '@material-ui/core';
const useToolbarStyles = makeStyles(theme => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 100%',
    },
  }));
  
  export const MainToolbar = ({ selected, updateList }) => {
    const classes = useToolbarStyles();
    const { experimentName } = useParams();

    const [isMergeOpen, setIsMergeOpen] = useState(false);
    const [isLoadingRun, setIsLoadingRun] = useState(false);

    const allSelected = [...selected.auto, ...selected.eyes, ...selected.merged ,...selected.custom];
    const numSelected = allSelected.length;
    const disabled = selected.auto.filter((selected) => selected.disabled) 
    

    const onExport = async (summaryData) => {
      const {type, name, creation_date} = summaryData;
      const file = await api.exportSummaryCsv(experimentName, type, name)
      saveAs(file, handleName(experimentName, name, creation_date));
    };

    const justDisabled = allSelected.length === disabled.length
        && allSelected.length > 0 ;
        
    const stringifySummaries = () => stringify({
      summaries: allSelected.map(sum => {
        const {name, type} = sum.data;
        return { name, type };
      })
    });

    const oneNotDisable = allSelected.length === 1 && disabled.length === 0 && allSelected[0];
    return (
      <div>
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        {numSelected > 0 ? (
          <Typography className={classes.title} color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography className={classes.title} variant="h6" id="tableTitle">
            All Summaries
          </Typography>
        )}

        {justDisabled && (isLoadingRun ? 
            <CircularProgress style={{marginRight: '10px'}} /> :
            <Button 
                id="main-toolbar-run-alg"
                color="inherit"
                onClick={ async () => {
                    setIsLoadingRun(true);
                    try{
                      await api.runAlgs(experimentName, selected.auto.map(auto => auto.data.name));
                      await updateList();
                    }finally{
                      setIsLoadingRun(false);
                    }
                }
            }>Run</Button> )}
       
        {oneNotDisable && [
            <Button 
                id="main-toolbar-view"
                key="1"
                onClick={() => window.open(`/article/${experimentName}/${oneNotDisable.data.type}/${oneNotDisable.data.name}`,'_blank')}
                color="inherit">View</Button>,
            <Button 
                key="2"
                onClick={() => onExport(oneNotDisable.data)}
                color="inherit">export</Button>,
            (false && <Button key="2" color="inherit">Info</Button>)
        ]}

        {allSelected.length > 1 && disabled.length === 0 && [
            <Button 
              id="main-toolbar-merge" key="3" color="inherit" onClick={ ()=> setIsMergeOpen(true)}>
                Merge</Button>,
            <Button 
              id="main-toolbar-layers"key="4" color="inherit" onClick={ () => {
              window.open(`/article-layers/${experimentName}?${stringifySummaries()}`,'_blank')}}>
                Compare</Button>
        ]}
      </Toolbar>
      {isMergeOpen && 
        <MergeDialog
            onClose = { async (mergedName)=> {
              if (mergedName){
                await updateList();
                window.open(`/article/${experimentName}/merged/${mergedName}`,'_blank')
              }
              setIsMergeOpen(false)
            }        
            }
            selected = { selected } />
      }
      </div>
    );
  };
  
  MainToolbar.propTypes = {
    selected: PropTypes.object.isRequired,
    updateList: PropTypes.func.isRequired
  };

  const handleName = (experimentName,name,date) => {
    const splited = name.split('.');
    const exportedTime = new Date(date).toLocaleDateString('en-US',{month: 'short', day:'numeric'});
    return `${experimentName}_${splited[0]}_(${exportedTime}).csv`;
  }