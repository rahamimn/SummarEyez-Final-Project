import React,{useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import MuiDialogTitle from '@material-ui/core/DialogTitle';

import api from '../../../../apiService';
import TableMerge from './TableMerge';
import {useParams} from 'react-router-dom'
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { ERROR_STATUS } from '../../../ERRORS';


export default function MergeDialog({
  onClose, selected 
}) {
  const formatSelected = (selectedSummaries) => selectedSummaries
    .map(summ =>({name: summ.data.name, type: summ.data.type, percentage: 0}));
    
  const addToInput = (selected) => [
   ...formatSelected(selected.auto),
   ...formatSelected(selected.eyes),
   ...formatSelected(selected.custom),
   ...formatSelected(selected.merged),
  ]

  const {experimentName} = useParams();
  
  useEffect(() => {
    setMergeInput(addToInput(selected));
  },[selected])
  
  const [mergeInput, setMergeInput] = useState(addToInput(selected))
  const [mergeName, setMergeName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [textColor, setTextColor] = useState("inherit")
  const [nameErrorText, setNameErrorText] = useState('')


  const setPercentageOf = (index) => (value) => {
    const mergeInputCopy = [...mergeInput];
    mergeInputCopy[index].percentage = value
    setMergeInput(mergeInputCopy);
    (percentTotalSum() === 1) ? setTextColor("primary") : setTextColor("error");
  }

  const handleChangeName = (event) =>{
    setNameErrorText('');
    setMergeName(event.target.value);
  }

  const percentTotalSum = () =>
    mergeInput.reduce((totPercent, record) => totPercent+record.percentage, 0)

  const isWeightSumValid = () => 
    percentTotalSum() === 1;
  
  const isDisabled = !isWeightSumValid() || mergeName.length === 0 || nameErrorText;


    return (
    <div>
      <Dialog 
        open={true} 
        onClose={() => onClose()}
        aria-labelledby="form-dialog-title"
        disableBackdropClick = {!!!onClose}
        fullWidth={true}
        maxWidth = {'md'}
        > 
        <DialogTitle id="form-dialog-title" onClose={onClose}>Merge Summaries</DialogTitle>
        <DialogContent>
          <DialogContentText>
          <TableMerge mergeInput={mergeInput} setPercentageOf={setPercentageOf}/>
          </DialogContentText>
          <div>
          <MuiThemeProvider theme={theme}>
            <Typography color={textColor} variant="subtitle1">
              Total: {parseInt((percentTotalSum()*100), 10)}
            </Typography>
          </MuiThemeProvider>
          </div>

          <div style={{
            width:'100%',
            display: 'flex',
            alignItems:"center",
            justifyContent:'space-between'}}>
          <TextField 
                error={nameErrorText}
                helperText={nameErrorText}
                value={mergeName}
                style={{marginBottom: '10px'}}
                onChange={handleChangeName}
                id="submit-merged-summary-name-input"
                label="Type new name..."
                />


          <Button
            id="create-merged-summary-btn"
            color="primary"
            disabled={isDisabled}
            onClick={
              async () => {
                setIsLoading(true);
                const {status} = await api.mergeAlgorithms(experimentName, mergeName, mergeInput);
                //TO-DO error handling
                if(status === ERROR_STATUS.NAME_NOT_VALID){
                  setNameErrorText('invalid name');
                }
                else if(status < 0){

                }
                else{
                  onClose(mergeName);
                }
                setIsLoading(false);
              }
              }>Create</Button>
          </div>

          {isLoading &&
            <div style={{ width: '100%', textAlign:'center', marginTop:'20px'}}>
              <LinearProgress/>
            </div>
          }

        </DialogContent>
      </Dialog>
    </div>
  );
}
const DialogTitle = (props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography  {...other} style={{
      width:'100%',
      display: 'flex',
      alignItems:"center",
      justifyContent:'space-between'}}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" onClick={() => onClose()}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
}


  const theme = createMuiTheme({ palette: { primary: { main: "#004f29" } } } );