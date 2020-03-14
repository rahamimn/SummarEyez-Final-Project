import React, {Component} from 'react'
import {DropzoneArea} from 'material-ui-dropzone'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Card from '@material-ui/core/Card'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import api from '../../../apiService';

export class UploadImage extends Component{
  constructor(props){
    super(props);
    this.state = {
      files: [],
      imageName: '',
      uploading: false,
    };
  }

    handleAddImage = async () => {
        this.setState({uploading: true});
        await api.uploadImage(this.state.imageName, this.state.files[0]);
        //error handling

        this.props.onImageUploaded && this.props.onImageUploaded(this.state.imageName);
    }

  handleChangeFile = (files) => {
    this.setState({
      files: files
    });
  }
  handleChangeName = (event) => {
    this.setState({
      imageName: event.target.value
    });
  }

  render(){
    return (
      <Card style={{width: '100%',margin:'20px 0 40px', padding:'20px'}}>
        <Typography variant="h5">
          Upload new Image
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
                value={this.state.imageName}
                style={{width: '200px', marginBottom: '20px'}}
                onChange={this.handleChangeName}
                id="standard-basic"
                label="Image Name" />
                
            <DropzoneArea 
                filesLimit={1}
                onChange={this.handleChangeFile}/>
            <Button 
                style={{display: 'block', marginTop: '15px', float: 'right'}}
                disabled={this.state.files.length === 0 || !this.state.imageName}
                variant="contained"
                color="primary"
                onClick={this.handleAddImage}>
                    Upload
            </Button>
          </div>}
        </div> 
      </Card>
    )  
  }
} 
