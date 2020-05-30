import React, { Component } from 'react'
import { DropzoneArea } from 'material-ui-dropzone'
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
import { CardContent } from '@material-ui/core'


export class UploadFixations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      fixationName: '',
      isNameExists: false,
      uploading: false,
      apiAlertShows: false,
      successShows: false,
    };
  }

  handleAddFixation = async () => {
    this.setState({ uploading: true });
    const { status } = await api.uploadFixations(this.props.experimentName, this.state.fixationName, this.state.files[0]);

    //error handling
    if (status === ERROR_STATUS.NAME_NOT_VALID) {
      this.setState({ uploading: false, files: [], isNameExists: true })
    }
    else if (status < 0) {
      this.setState({ apiAlertShows: true, uploading: false, files: [] })
    }
    else {
      //success
      this.setState({ uploading: false,fixationName:'',files: [], isNameExists: false, successShows: true });
    }

  }

  handleChangeFile = (files) => {
    this.setState({
      files: files
    });
  }
  handleChangeName = (event) => {
    this.setState({
      fixationName: event.target.value,
      isNameExists: false
    });
    this.setState({ isNameExists: false });
  }

  handleCloseAlert = () => this.setState({ apiAlertShows: false });
  handleSuccessAlert = () => this.setState({ successShows: false });

  render() {
    return (
      <Card style={{ width: '100%', margin: '20px 0 40px', padding: '20px' }}>
        <Typography variant="h5">
          Upload New Fixation File
        </Typography>
        <Divider />

        <div>
          {this.state.uploading ?
            <div style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
              <CircularProgress />
            </div>
            :
            <div>
              <TextField
                error={this.state.isNameExists}
                helperText={this.state.isNameExists && "Name already exsits, please choose different name"}
                value={this.state.fixationName}
                style={{ marginBottom: '20px' }}
                onChange={this.handleChangeName}
                id="standard-basic"
                label="Insert fixation name"
              />

              <DropzoneArea
                filesLimit={1}
                onChange={this.handleChangeFile}
                acceptedFiles={[".csv", "text/csv"]}
                dropzoneText={"Upload your fixation file here"}
              />
              
              <Button
                style={{ marginTop: '20px' }}
                disabled={this.state.files.length === 0 || !this.state.fixationName}
                variant="contained"
                color="primary"
                onClick={this.handleAddFixation}>
                Upload fixation
              </Button>

              <Card variant="outlined" style={{backgroundColor:'#eeeeee', marginTop:'40px'}}>
                <CardContent>
                  <Typography style={{display:'block'}}>Instructions & Constraints</Typography>
                  <Typography style={{display:'block'}} >
                    1. upload csv file, as output from the begaze system(.csv). <br/>
                    2. required fields "Event Duration [ms]","Fixation Position X [px]","Fixation Position Y [px]" <br/>
                    3. max size 2MB. <br/>
                  </Typography>
                </CardContent>
              </Card>
            </div>}
        </div>

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={this.state.apiAlertShows}
          onClose={this.handleCloseAlert}>
          <Alert variant="filled" severity="error" onClose={this.handleCloseAlert} > Error has occured in system</Alert>
        </Snackbar>

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={this.state.successShows}
          onClose={this.handleSuccessAlert}>
          <Alert variant="filled" severity="success" onClose={this.handleSuccessAlert}> Uploaded Successfully </Alert>
        </Snackbar>
      </Card>

    )
  }
} 
