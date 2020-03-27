import React ,{useState,useEffect} from 'react';
import {
    useParams,
  } from "react-router-dom";
import { ArticleViewer } from './ArticleViewer';
import api from '../../apiService';

  
export const ArticleMain = () => {
    const {experimentName,type,name} = useParams();
    const [json,setJson ] = useState([]);

    useEffect(() => {
      const fetch = async () => {
        const json = await api.getSummary(experimentName,type,name);
        setJson(json.data);
      }
      fetch();
    },[]);

    return <ArticleViewer json={json}/>
}