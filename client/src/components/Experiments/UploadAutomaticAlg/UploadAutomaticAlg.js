import React, {Component} from 'react'
import {DropzoneArea} from 'material-ui-dropzone'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import api from '../../../apiService';
import CircularProgress from '@material-ui/core/CircularProgress'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import { ERROR_STATUS } from '../../ERRORS';


export class UploadAlgorithm extends Component{
  constructor(props){
    super(props);
    this.state = {
      files: [],
      algorithmName: '',
      uploading: false,
      apiAlertShows: false,
      successShows: false,
    };
  }

  handleAddAlg = async () => {
    this.setState({uploading: true});
    const {status} = await api.uploadAlgorithm(this.state.algorithmName, this.state.files[0]);
    
    //error handling
    if(status === ERROR_STATUS.NAME_NOT_VALID){
      this.setState({uploading:false, files: [], nameError: true })
    }
    else if(status < 0){
      this.setState({apiAlertShows: true, uploading:false, files: []})
    }
    else{
      this.setState({uploading: false, nameError: status === -1, successShows: true}); 
  }
    
  }

  handleChangeFile = (files) => {
    this.setState({
      files: files
    });
  }
  handleChangeName = (event) => {
    this.setState({
      algorithmName: event.target.value,
      nameError: false 
    });
  }

  handleCloseAlert = () => this.setState({apiAlertShows: false});
  handleSuccessAlert = () => this.setState({successShows: false});
  

  render(){
    return (  
      <Card style={{width: '100%',margin:'20px 0 40px', padding:'20px'}}>
      <Typography variant="h5">
        Upload New Algorithm
      </Typography>
      <Divider/>
      <div> 
        {this.state.uploading ? 
          <div style={{ width: '100%', textAlign:'center', marginTop:'20px'}}>
            <CircularProgress />
          </div>
        :
        <div>
          <TextField 
              error={this.state.nameError}
              helperText={this.state.nameError && "Name already exsits, please choose different name" }
              value={this.state.algorithmName}
              style={{marginBottom: '20px'}}
              onChange={this.handleChangeName}
              id="standard-basic"
              label="Insert algorithm name"
          />
                
          <DropzoneArea
              filesLimit={1}
              onChange={this.handleChangeFile}
              acceptedFiles={["text/py/*"]}
              dropzoneText={"Upload your python script here"}
          />

          <Button 
              style={{display: 'block', marginTop: '15px', float: 'right'}}
              disabled={this.state.files.length === 0 || !this.state.algorithmName}
              variant="contained"
              color="primary"
              onClick={this.handleAddAlg}>
                  Upload algorithm  
          </Button>
        </div>}
      </div> 
      
        <Snackbar 
          anchorOrigin={{ vertical:'top', horizontal:'center' }}
          open={this.state.apiAlertShows}
          onClose={this.handleCloseAlert}>
          <Alert variant="filled" severity="error" onClose={this.handleCloseAlert} > Error has occured in system</Alert>
        </Snackbar>

        <Snackbar 
          anchorOrigin={{ vertical:'top', horizontal:'center' }}
          open={this.state.successShows}
          onClose={this.handleSuccessAlert}>
          <Alert variant="filled" severity="success" onClose={this.handleSuccessAlert}> Uploaded Successfully </Alert>
        </Snackbar>

      </Card>    
    )  
  }
} 
