import React, { useState, useEffect, useCallback} from 'react'
import Typography from '@material-ui/core/Typography'
import api from '../../../apiService';
import {useParams} from 'react-router-dom'
import { Grid, Card, Divider, CircularProgress, Modal, Dialog, Button, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { BaseViewer } from '../../Viewers/BaseViewer/BaseViewer';
import DoubleArrowRoundedIcon from '@material-ui/icons/DoubleArrowRounded';
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

export function ExperimentInfo() {
  const {experimentName} = useParams()
  const [experimentInfo,setExperimentInfo] = useState(null)
  const [ocrModalOpen,setOcrModalOpen] = useState(false)

  const fetchExperimentInfo = useCallback (async () => {
    const res = await api.getExperimentInfo(experimentName); 
		setExperimentInfo(res.data);
  },[experimentName]);

  useEffect(() => {
    fetchExperimentInfo();
  }, [fetchExperimentInfo])
	
  return (
    <div style={{ flexGrow: 1}}>
    <Grid container spacing={3} style={{width:"100%"}}>
      <Grid item xs={12} sm={6}>
        <Card style={{padding: '20px'}}>
          <div style={{display:'flex', justifyContent:'space-between'}}>
						<Typography variant="h5">
							{experimentName} Info
						</Typography>
						<Button color="primary" onClick={() => setOcrModalOpen(true)}>
							Show OCR
						</Button>
					</div>
					<Divider/>
         
          {experimentInfo ? 
              <div>
                <Typography>{experimentInfo.description}</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <DoubleArrowRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Questions: ${experimentInfo.questionsCounter}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DoubleArrowRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Forms: ${experimentInfo.formsCounter}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DoubleArrowRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Test: ${experimentInfo.testsCounter}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DoubleArrowRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Fixations Uploaded: ${experimentInfo.fixationsUploadedCounter}`}
                    />
                  </ListItem>
                </List>
              </div> :
              <div style={{padding:'40px'}}>
                <CircularProgress/>
              </div>
					}
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        {experimentInfo && ArticleImage(experimentInfo.image_path)}

      </Grid>
    </Grid>  
		<Dialog maxWidth='md' open={ocrModalOpen} onClose={() => setOcrModalOpen(false)}>
			{experimentInfo &&  		
				<BaseViewer
					summary={experimentInfo.base_sent_table}
					title={'OCR text'}
					filters={{
						color: {size:'8', palete: 'op_1'},
						isGradient: true,
						minWeight: 0,
					}}
				/>
			}
			</Dialog>
  </div> 
  );
}

