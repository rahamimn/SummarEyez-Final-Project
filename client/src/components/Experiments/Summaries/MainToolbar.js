import React from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import api from '../../../apiService';
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
  
    const allSelected = [...selected.auto, ...selected.eyes, ...selected.merged];
    const numSelected = allSelected.length;
    const disabled = selected.auto.filter((selected) => selected.disabled) 
    
    const justDisabled = allSelected.length === disabled.length
        && allSelected.length > 0 ;

    return (
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
        {justDisabled && 
            <Button 
                color="inherit"
                onClick={ async () => {
                    await api.runAlgs();
                    await updateList;
                }
            }>Run</Button> }
       
        {allSelected.length === 1 && disabled.length === 0 && [
            <Button 
                key="1"
                color="inherit">View</Button>,
            <Button key="2" color="inherit">Info</Button>
        ]}

        {allSelected.length > 1 && disabled.length === 0 && [
            <Button key="3" color="inherit">Merge</Button>,
            <Button key="4" color="inherit">Layers</Button>
        ]}
      </Toolbar>
    );
  };
  
  MainToolbar.propTypes = {
    selected: PropTypes.object.isRequired,
    updateList: PropTypes.func.isRequired
  };