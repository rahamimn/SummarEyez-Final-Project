import React, {Component} from 'react'
import {DropzoneArea} from 'material-ui-dropzone'
import axios from 'axios';
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { UploadImage } from '../UploadImage/UploadImage';
import TableSummaries from './TableSummaries';

export class Summaries extends Component{
  constructor(props){
    super(props);
    this.state = {
      images: []
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
    // this.setState({
    //   experimentName: event.target.value
    // });
  }

  render(){
    return (
      <Card style={{minHeight:'700px'}}>
        <CardContent>
          <TableSummaries images={this.state.images}/>
        </CardContent>
      </Card>
    )  
  }
} 
