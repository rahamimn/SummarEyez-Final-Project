import React, {Component} from 'react'
import {DropzoneArea} from 'material-ui-dropzone'
import TextField from '@material-ui/core/TextField'
import CardContent from '@material-ui/core/CardContent'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Card from '@material-ui/core/Card'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import api from '../../../../apiService';
import { ERROR_STATUS } from '../../../ERRORS';

export class UploadImage extends Component{
  constructor(props){
    super(props);
    this.state = {
      files: [],
      imageName: '',
      uploading: false,
      apiAlertShows: false,
      nameError: false,
    };
  }

    handleAddImage = async () => {
        this.setState({uploading: true});
        const {status} = await api.uploadImage(this.state.imageName, this.state.files[0]);
        //error handling
        if(status === ERROR_STATUS.NAME_NOT_VALID){
          this.setState({uploading:false, files: [], nameError: true })
        }
        else if(status < 0){
          this.setState({apiAlertShows: true, uploading:false, files: []})
        }
        else{
          this.props.onImageUploaded && this.props.onImageUploaded(this.state.imageName);
        }
    }

  handleChangeFile = (files) => {
    this.setState({
      files: files
    });
  }
  handleChangeName = (event) => {
    this.setState({
      imageName: event.target.value,
      nameError: false 
    });
  }
  handleCloseAlert = () => this.setState({apiAlertShows: false});

  render(){
    return (
      <div>
      <Card style={{width: '100%',margin:'20px 0 40px', padding:'20px'}}>
        <Typography variant="h5">
          Upload new Image
        </Typography>
        <Divider/>
        <div> 
          {this.state.uploading ? 
            <div id="uplaod-image-loader" style={{ width: '100%', textAlign:'center', marginTop:'20px'}}>
              <CircularProgress />
            </div>
          :
          <div>
            <TextField 
                error={this.state.nameError}
                helperText={this.state.nameError && "name not valid"}
                value={this.state.imageName}
                style={{width: '200px', marginBottom: '20px'}}
                onChange={this.handleChangeName}
                id="upload-image-image-name"
                label="Image Name" />
            <DropzoneArea
                
                acceptedFiles={["images/*",".jpeg",".jpg"]}
                filesLimit={1}
                onChange={this.handleChangeFile}/>
            <div style={{width:'100%', display:'flex', justifyContent:'flex-end'}}>
              <Button 
                  id="upload-image-submit-button"
                  style={{display: 'block', marginTop: '15px'}}
                  disabled={this.state.files.length === 0 || !this.state.imageName}
                  variant="contained"
                  color="primary"
                  onClick={this.handleAddImage}>
                      Upload
              </Button>
            </div>
            <Card variant="outlined" style={{backgroundColor:'#eeeeee', marginTop:'40px'}}>
              <CardContent>
                <Typography style={{display:'block'}}>Instructions & Constraints:</Typography>
                <Typography variant="caption"  style={{display:'block'}} >
                  1. Upload .jpg file<br/>
                  2. The file must contain text only.<br/>
                  3. Max file size: 2MB. <br/>
                  4. Your image text should include '.' only as sentence seperator.<br/>
                </Typography>
              </CardContent>
            </Card>

          </div>}
          
        </div> 
        <Snackbar 
          anchorOrigin={{ vertical:'top', horizontal:'center' }}
          open={this.state.apiAlertShows}
          onClose={this.handleCloseAlert}>
          <Alert elevation={6} variant="filled" onClose={this.handleCloseAlert} severity="error">
            Error has occured in system
          </Alert>
        </Snackbar>

      </Card>
     
      </div>
    )  
  }
} 
