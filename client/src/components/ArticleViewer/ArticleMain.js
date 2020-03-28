import React ,{useState,useEffect} from 'react';
import {
    useParams,
  } from "react-router-dom";
import { ArticleViewer } from './ArticleViewer';
import api from '../../apiService';
import Card from '@material-ui/core/Card';
import Container from '@material-ui/core/Container';

  
export const ArticleMain = () => {
    const {experimentName,type,name} = useParams();
    const [summary,setSummary ] = useState([]);

    useEffect(() => {
      const fetch = async () => {
        const res = await api.getSummary(experimentName,type,name);
        setSummary(res.data);
      }
      fetch();
    },[]);

    return <Container>
        <Card elevation={4}>
            <ArticleViewer summary={summary}/>
        </Card>
        </Container>
}