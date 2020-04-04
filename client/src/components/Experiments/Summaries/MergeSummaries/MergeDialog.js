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
  onClose, selected,
}) {
  const history = useHistory();

  return (
    <div>
      console.log("here2");
      <Dialog 
        open={true} 
        onClose={onClose}
        aria-labelledby="form-dialog-title"
        disableBackdropClick = {!!!onClose}
        > 
        <DialogTitle id="form-dialog-title">Summary-merge wizzard</DialogTitle>
        <DialogContent>
          <DialogContentText>
          <TableMerge />
          </DialogContentText>
          <Button onClick={onClose}>Create</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
