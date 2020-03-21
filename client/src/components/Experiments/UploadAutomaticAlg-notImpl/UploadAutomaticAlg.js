import React, {Component} from 'react'
import {DropzoneArea} from 'material-ui-dropzone'
import axios from 'axios';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import api from '../../../apiService';


export class UploadAlgorithm extends Component{
  constructor(props){
    super(props);
    this.state = {
      files: [],
      algorithmName: '',
      isNameExists: false
    };
  }

  handleAddAlg = async () => {
    this.setState({uploading: true});
    const {status} = await api.uploadAlgorithm(this.state.algorithmName, this.state.files[0]);
    this.setState({uploading: false, isNameExists: status === -1}); 
  }

  handleChangeFile = (files) => {
    this.setState({
      files: files
    });
  }
  handleChangeName = (event) => {
    this.setState({
      algorithmName: event.target.value
    });
    this.setState({ isNameExists: false} ); 
  }

  render(){
    return (  
      <Card style={{ width: '60%' }}>
      <div style=
        {{ 
          padding:20,
          backgroundColor: '#dcdcdc',
          height: 800,
          width:'100%',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPositionX: 'center'
      }}>
            <TextField 
                error={this.state.isNameExists}
                helperText={this.state.isNameExists && "Name already exsits, please choose different name" }
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
                style={{marginTop: '20px'}}
                disabled={this.state.files.length === 0 || !this.state.algorithmName}
                variant="contained"
                color="primary"
                onClick={this.handleAddAlg}>
                    Upload algorithm  
            </Button>
        </div> 
        </Card>  

      
    )  
  }
} 
