import React,{useState, useEffect} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {useHistory} from "react-router-dom";
import api from '../../apiService';
import TabPanel from './TabPanel';

export default function WelcomeDialog({
  onClose,
  permit,
}) {
  const history = useHistory();
  const [permKey,setPermKey] = useState();
  const [experimentText,setExperimentText] = useState();
  const [experiments,setExperiments] = useState();
  
  useEffect(() => {
    fetchExperiments();
  },[]);

  const fetchExperiments = async () => {
    const res = await api.getExperiments();
    setExperiments(res.data);
  }
  const validate = () => {
    permit(false);
    if(permKey === '1234'){
      permit();
      return true;
    }
    return false;
  }

  return (
    <div>
      <Dialog 
        open={true} 
        onClose={onClose}
        aria-labelledby="form-dialog-title"
        disableBackdropClick = {!!!onClose}
        disableEscapeKeyDown = {!!!onClose}
        >
        <DialogTitle id="form-dialog-title">Welcome to SummarEYEZ </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please choose your option:
          </DialogContentText>
          <TabPanel permit={permit}></TabPanel>
        </DialogContent>
      </Dialog>
    </div>
  );
}
