import React,{useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import api from '../../../../apiService';
import TableMerge from './TableMerge';
import {useParams} from 'react-router-dom'
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';



export default function MergeDialog({
  onClose, selected 
}) {
  const addToInput = (selected) => [
   ...selected.auto.map(a =>({name: a.data.name, type: a.data.type, percentage: 0})),  
   ...selected.eyes.map(a =>({name: a.data.name, type: a.data.type, percentage: 0})),
   ...selected.merged.map(a =>({name: a.data.name, type: a.data.type, percentage: 0}))
  ]

  const {experimentName} = useParams();
  
  const [mergeInput, setMergeInput] = useState(addToInput(selected))
  const [mergeName, setMergeName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [textColor, setTextColor] = useState("inherit")
  const [isSubmitted, setIsSubmitted] = useState(false)


  const setPercentageOf = (index) => (value) => {
    const mergeInputCopy = [...mergeInput];
    mergeInputCopy[index].percentage = value
    setMergeInput(mergeInputCopy);
    (percentTotalSum() === 1) ? setTextColor("primary") : setTextColor("error");
  }

  const handleChangeName = (event) =>
    setMergeName(event.target.value)

  const percentTotalSum = () =>
    mergeInput.reduce((totPercent, record) => totPercent+record.percentage, 0)

  const isWeightSumValid = () => 
    percentTotalSum() === 1;
  
  const isDisabled = !isWeightSumValid() || mergeName.length === 0 || isSubmitted;


    return (
    <div>
      <Dialog 
        open={true} 
        onClose={onClose}
        aria-labelledby="form-dialog-title"
        disableBackdropClick = {!!!onClose}
        fullWidth={true}
        maxWidth = {'md'}
        > 
        <DialogTitle id="form-dialog-title">Summary-merge wizzard</DialogTitle>
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

          <div>
          <TextField 
                // error={this.state.isNameExists}
                // helperText={this.state.isNameExists && "Name already exsits, please choose different name" }
                value={mergeName}
                style={{marginBottom: '10px'}}
                onChange={handleChangeName}
                id="standard-basic"
                label="Type new name..."
                />
          </div>

          <Button
            color="primary"
            disabled={isDisabled}
            onClick={
              async () => {
                setIsSubmitted(true)
                setIsLoading(true);
                const res = await api.mergeAlgorithms(experimentName, mergeName, mergeInput);
                setIsLoading(false);
                onClose(mergeName);
              }
              }>Create</Button>


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

  const theme = createMuiTheme({ palette: { primary: { main: "#004f29" } } } );