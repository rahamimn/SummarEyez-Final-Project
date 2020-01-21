import React, {Component} from 'react'
import {DropzoneArea} from 'material-ui-dropzone'
import axios from 'axios';
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { UploadImage } from '../UploadImage/UploadImage';

const ArticleImage = (imagePath) =>
      <div style={{
          height: 800,
          width:600,
          backgroundImage: `url("https://storage.googleapis.com/summareyez-6b61e.appspot.com/${imagePath}")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPositionX: 'center'
          }}/>

export class NewExperiment extends Component{
  constructor(props){
    super(props);
    this.state = {
      images: [],
      image: null,
      imageName: '',
      experimentName: '',
      uploadingNewImage: false,
    };
  }

  componentDidMount(){
    this.fetchImages();
  }

  fetchImages = async () => {
    const res = await axios.get('/api/images');
    this.setState({images: res.data});
  }

  handleChangeExperimentName = (event) => {
    this.setState({
      experimentName: event.target.value
    });
  }

  render(){
    return (
        <div style={{ flexGrow: 1}}>
          <Grid container spacing={3} style={{width:"100%"}}>
            <Grid item xs={12} sm={6}>
              <Card style={{padding: '20px'}}>
                <Typography>
                  Create New Experiment
                </Typography>
                <TextField 
                  value={this.state.experimentName}
                  style={{marginBottom: '20px'}}
                  onChange={this.handleChangeExperimentName}
                  id="text-experiments"
                  label="Experiment Name" />

                <Autocomplete
                  id="legue-select"
                  style={{ width: 300, marginRight:10 }}
                  options={this.state.images}
                  autoHighlight
                  getOptionLabel={option => option.id}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Choose an image"
                      // variant="outlined"
                      fullWidth
                      inputProps={{
                          ...params.inputProps,
                          autoComplete: 'disabled', // disable autocomplete and autofill
                      }}
                    />
                  )}
                  onChange={(e,image) => {
                    this.setState({image});
                  }}
                  onInputChange={(e, value) => 
                    this.setState({imageName: value})
                  }
                  inputValue={this.state.imageName}

                />
                {!this.state.uploadingNewImage &&
                  <Button 
                    style={{display: 'block'}}
                    color="primary"
                    onClick={() => this.setState({
                      uploadingNewImage: !this.state.uploadingNewImage
                    })}>
                        Upload new Image
                  </Button> 
                  }
                  {this.state.uploadingNewImage && 
                    <UploadImage 
                      onImageUploaded ={async (imageName) => {
                        await this.fetchImages();
                        this.setState({
                          uploadingNewImage: false,
                          image: this.state.images.find(image => image.id === imageName),
                          imageName
                        })
                      }}/>}
                <Button 
                  style={{marginTop: '20px', textAlign:'end'}}
                  disabled={!!(!this.state.image || !this.state.experimentName)}
                  variant="contained"
                  color="primary"
                  onClick={this.handleAddImage}>
                    Create
                </Button> 
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              {this.state.image && ArticleImage(this.state.image.data.image_path)}
            </Grid>
          </Grid>  
        </div> 
    )  
  }
} 
