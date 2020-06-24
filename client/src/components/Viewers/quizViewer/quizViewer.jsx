import React ,{useState,useEffect} from 'react';
import { BaseViewer } from "../BaseViewer/BaseViewer";
import api from '../../../apiService';
import { CircularProgress } from '@material-ui/core';

export const QuizViewer = ({
  experimentName,
  type,
  name,
  filters = {},
  thumbnail = false
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
        setLoader(false);

        if(res.status!==0){
          return;
        }
        setSummaryDetails(res.data);
      }
      fetch();
    },[name, type, filters, experimentName]);

    return loader ? <div style={{width:'100%', height:'100px', display:'flex',justifyContent:'center', alignItems:'center'}} ><CircularProgress size="60px"/></div> : 
           <BaseViewer 
              thumbnail={thumbnail}
              summary={summaryDetails.summary} 
              title={summaryDetails.title}
              filters ={{
                color: filters.color || {size:'3', palete:'Green'},
                hideUnderMin: filters.hideUnderMin || false,
                minWeight: filters.minWeight || 0,
                topSentencesCount:21
              }}/>
          

}