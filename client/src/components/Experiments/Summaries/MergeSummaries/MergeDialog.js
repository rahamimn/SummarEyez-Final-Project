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
import CircularProgress from '@material-ui/core/CircularProgress'



export default function MergeDialog({
  onClose, selected 
}) {
  const addToInput = (selected) => [
   ...selected.auto.map(a =>({name: a.data.name, type: a.data.type, percentage: 0})),  
   ...selected.eyes.map(a =>({name: a.data.name, type: a.data.type, percentage: 0})),
   ...selected.merged.map(a =>({name: a.data.name, type: a.data.type, percentage: 0}))
  ]

  const {experimentName} = useParams();

  var percentTotalSum = () => 
    mergeInput.reduce((totPercent, record) => totPercent + record.percentage,0);
  
  const [mergeInput, setMergeInput] = useState(addToInput(selected))
  const [mergeName, setMergeName] = useState("")
  const [isLoading, setIsLoading] = useState(false)


  const setPercentageOf = (index) => (value) => {
    const mergeInputCopy = [...mergeInput];
    mergeInputCopy[index].percentage = value
    setMergeInput(mergeInputCopy)
  }

  const isDisabled = percentTotalSum() !== 1;

  const handleChangeName = (event) => setMergeName(event.target.value)
  

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
        
          
          <TextField 
                // error={this.state.isNameExists}
                // helperText={this.state.isNameExists && "Name already exsits, please choose different name" }
                value={mergeName}
                style={{marginBottom: '20px'}}
                onChange={handleChangeName}
                id="standard-basic"
                label="Insert merge-product name"
                />


          <Button
            disabled={isDisabled}
            onClick={
              async () => {
                setIsLoading(true);
                const res = await api.mergeAlgorithms(experimentName, mergeName, mergeInput);
                setIsLoading(false);
                onClose(mergeName);
              }
              }>Create</Button>
              
          
          {isLoading &&
            <div style={{ width: '100%', textAlign:'center', marginTop:'20px'}}>
              <CircularProgress />
            </div>
          }

        </DialogContent>
      </Dialog>
    </div>
  );
}
