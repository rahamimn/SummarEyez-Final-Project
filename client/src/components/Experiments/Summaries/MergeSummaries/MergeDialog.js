import React,{useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  useHistory,
} from "react-router-dom";
import TableMerge from './TableMerge';


export default function MergeDialog({
  onClose, selected, totalSum
}) {
  const history = useHistory();

  const addToInput = (selected) => [
    ...selected.auto.map(a =>({name: a.data.name, type: a.data.type, percent: 0})),  

             // ### NIR: Check for 'undefined' before using map(); ###
  // ...selected.eyes.map(a =>({name: a.data.name, type: a.data.type, percent: 0})),
  //...selected.merge.map(a =>({name: a.data.name, type: a.data.type, percent: 0}))
  ]

  const [mergeInput, setMergeInput] = useState(addToInput(selected))

  const setPercentageOf = (index) => (value) => {
    mergeInput[index].percent = value
    console.log("mergeInput[",index,"].percent", mergeInput[index].percent)
    setMergeInput(mergeInput)
    console.log(mergeInput)
  }
  

  const getPercentageOf = (index)  => {
    return mergeInput[index].percent
  }

  const setTotalSum = (val) => {
    totalSum = val};
    console.log("totalSum", totalSum);

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
          <TableMerge mergeInput={mergeInput} setPercentageOf={setPercentageOf} getPercentageOf={getPercentageOf} setTotalSum={setTotalSum}/>
          </DialogContentText>
          <Button
            onClick={
              /* Call api to make the merge */
             onClose}>Create</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
