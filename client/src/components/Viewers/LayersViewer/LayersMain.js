import React ,{useState,useEffect} from 'react';
import {
    useLocation,
    useParams
  } from "react-router-dom";
import { parse } from 'qs'
import { LayersViewer } from './LayersViewer';
import api from '../../../apiService';
import Card from '@material-ui/core/Card';
import Container from '@material-ui/core/Container';


const useQuery = () => parse(useLocation().search.substr(1));

  
export const LayersMain = () => {
    const query = useQuery();
    const { experimentName } = useParams();

    const [summariesDetails,setSummariesDetails] = useState({
      title: '',
      summaries:[[]]
    });

    useEffect(() => {
      const fetch = async () => {
        const responses = await Promise.all(query.summaries.map(
          summary => api.getSummary(experimentName,summary.type,summary.name)
          )
        );

        setSummariesDetails({
          title: responses[0].data.title,
          summaries: responses.map(sum => sum.data.summary)
        });
      }
      fetch();
    },[]);

    return <Container>
        <Card elevation={4}>
            <LayersViewer 
              experimentName={experimentName}
              summariesMetadata={query.summaries}
              summaries={summariesDetails.summaries}
              title={summariesDetails.title}/>
        </Card>
        </Container>
}