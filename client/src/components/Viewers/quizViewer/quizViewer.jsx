import React ,{useState,useEffect} from 'react';
import { BaseViewer } from "../BaseViewer/BaseViewer";
import api from '../../../apiService';
import { CircularProgress } from '@material-ui/core';

export const QuizViewer = ({
  experimentName,
  type,
  name,
  filters = {},
}) => {
  const [loader,setLoader] = useState(false);
    const [summaryDetails,setSummaryDetails] = useState({
      title: '',
      summary:[]
    });

    useEffect(() => {
      const fetch = async () => {
        setLoader(true);
        const res = await api.getSummary(experimentName,type,name);
        setSummaryDetails(res.data);
        setLoader(false);
      }
      fetch();
    },[name, type, filters, experimentName]);

    return loader ? <div style={{width:'100%', height:'100px', display:'flex',justifyContent:'center', alignItems:'center'}} ><CircularProgress size="60px"/></div> : 
           <BaseViewer 
              summary={summaryDetails.summary} 
              title={summaryDetails.title}
              filters ={{
                color: filters.color || {size:'3', palete:'op_1'},
                isGradient: filters.isGradient !== undefined ? filters.isGradient : true,
                minWeight: filters.minWeight || 0,
                topSentencesCount:21
              }}/>
          

}