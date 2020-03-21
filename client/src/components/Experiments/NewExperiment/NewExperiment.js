import React, {Component} from 'react'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { UploadImage } from '../UploadImage/UploadImage';
import api from '../../../apiService';
import { withRouter } from "react-router-dom";

const ArticleImage = (imagePath) =>
  <Card>  
    <div style={{padding:20, backgroundColor: '#dcdcdc',}}>
      <div style={{
          height: 800,
          width:'100%',
          backgroundImage: `url("https://storage.googleapis.com/summareyez-6b61e.appspot.com/${imagePath}")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPositionX: 'center'
          }}/>
    </div>
  </Card>

class NewExperimentComponent extends Component{
  constructor(props){
    super(props);
    this.state = {
      isNameExists: false,
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
    const images = await api.getImages();
    this.setState({images});
  }

  handleAddExperiment = async () => {
    const res = await api.addExperiment(this.state.experimentName, this.state.imageName);
    if(res.status !== 0){
      this.setState({
        isNameExists: true
      });
    }
    else{
      this.props.history.push(`/experiments/${this.state.experimentName}`);
    }
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
                <Typography variant="h5">
                  Create New Experiment
                </Typography>
                <Divider/>
                <TextField 
                  error={this.state.isNameExists}
                  helperText={this.state.isNameExists && "Name already exsits, please choose different name" }
                  value={this.state.experimentName}
                  style={{width: '200px',marginTop:'10px', marginBottom: '20px'}}
                  onChange={this.handleChangeExperimentName}
                  id="text-experiments"
                  label="Experiment Name" />

                <Autocomplete
                  id="legue-select"
                  style={{ width: '200px', marginRight:10 }}
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
                    </Button> }
                <Button 
                  style={{marginTop: '20px', float:'right'}}
                  disabled={!!(!this.state.image || !this.state.experimentName)}
                  variant="contained"
                  color="primary"
                  onClick={this.handleAddExperiment}>
                    Create
                </Button> 
              </Card>

              {this.state.uploadingNewImage &&   <UploadImage 
                      onImageUploaded ={async (imageName) => {
                        await this.fetchImages();
                        this.setState({
                          uploadingNewImage: false,
                          image: this.state.images.find(image => image.id === imageName),
                          imageName
                        })
                    }}/>}
            </Grid>
            <Grid item xs={12} sm={6}>
              {this.state.image && ArticleImage(this.state.image.data.image_path)}
            </Grid>
          </Grid>  
        </div> 
    )  
  }
} 
export const NewExperiment = withRouter(NewExperimentComponent);
