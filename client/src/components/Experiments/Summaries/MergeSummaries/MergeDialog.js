import React,{useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import api from '../../../../apiService';
import TableMerge from './TableMerge';


export default function MergeDialog({
  onClose, selected 
}) {
  const addToInput = (selected) => [
   ...selected.auto.map(a =>({name: a.data.name, type: a.data.type, percentage: 0})),  
   ...selected.eyes.map(a =>({name: a.data.name, type: a.data.type, percentage: 0})),
   ...selected.merged.map(a =>({name: a.data.name, type: a.data.type, percentage: 0}))
  ]

  var percentTotalSum = () => 
    mergeInput.reduce((totPercent, record) => totPercent + record.percent,0);
  
  const [mergeInput, setMergeInput] = useState(addToInput(selected))

  const setPercentageOf = (index) => (value) => {
    const mergeInputCopy = [...mergeInput];
    mergeInputCopy[index].percent = value
    setMergeInput(mergeInputCopy)
  }

  const isDisabled = percentTotalSum() !== 100;

    return (
    <div>
      console.log("here2");
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
          
          {/* <TextField 
                  style={{width: '200px',marginTop:'10px', marginBottom: '20px'}}
                  label="New Summary Name" />
                  default={}
                  InputProps={{endAdornment: <YOUR_COPY_ICON_BUTTON />}} */}

          <Button
            disabled={isDisabled}
            onClick={ /* api.mergeAlgorithms("experimentName_"+100*Math.random(1000), "mergedName_"+100*Math.random(1000), mergeInput),*/ 
             onClose}>Create</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
