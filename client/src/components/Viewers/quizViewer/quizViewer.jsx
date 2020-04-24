import React ,{useState,useEffect} from 'react';
import { BaseViewer } from "../BaseViewer/BaseViewer";
import { Card } from '@material-ui/core';
import api from '../../../apiService';

export const QuizViewer = ({
  experimentName,
  type,
  name,
  filters
}) => {
    const [summaryDetails,setSummaryDetails] = useState({
      title: '',
      summary:[]
    });

    useEffect(() => {
      const fetch = async () => {
        console.log(experimentName,type,name);
        const res = await api.getSummary(experimentName,type,name);
        setSummaryDetails(res.data);
      }
      fetch();
    },[]);

    return <BaseViewer 
            summary={summaryDetails.summary} 
            title={summaryDetails.title}
            filters ={{
              color:90,
              isGradinet:true,
              minWeight:0,
              topSentencesCount:21
            }}/>

}