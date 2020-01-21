import React, {Component} from 'react'
import {DropzoneArea} from 'material-ui-dropzone'
import axios from 'axios';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

export class UploadImage extends Component{
  constructor(props){
    super(props);
    this.state = {
      files: [],
      imageName: ''
    };
  }

    handleAddImage = async () => {
        const formData = new FormData();
        formData.append('imageBuffer', this.state.files[0]);
        formData.append('imageName', this.state.imageName);

        const res = await axios.post('/api/upload',formData,{ 
            headers:{
                "Content-Type": "multipart/form-data"
            },
        });
        this.props.onImageUploaded && this.props.onImageUploaded();
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
        <div style={{width: '100%', marginBottom: '40px'}}>
            <TextField 
                value={this.state.imageName}
                style={{marginBottom: '20px'}}
                onChange={this.handleChangeName}
                id="standard-basic"
                label="Image Name" />
                
            <DropzoneArea 
                filesLimit={1}
                onChange={this.handleChangeFile}/>
            <Button 
              
                disabled={this.state.files.length === 0 || !this.state.imageName}
                variant="contained"
                color="primary"
                onClick={this.handleAddImage}>
                    Primary
            </Button>
        </div> 
    )  
  }
} 
