import React ,{useState,useEffect} from 'react';
import { BaseViewer } from "../BaseViewer/BaseViewer";
import api from '../../../apiService';

export const QuizViewer = ({
  experimentName,
  type,
  name,
  filters = {}
}) => {
    const [summaryDetails,setSummaryDetails] = useState({
      title: '',
      summary:[]
    });

    useEffect(() => {
      const fetch = async () => {
        const res = await api.getSummary(experimentName,type,name);
        setSummaryDetails(res.data);
      }
      fetch();
    },[name, type, filters, experimentName]);

    return <BaseViewer 
            summary={summaryDetails.summary} 
            title={summaryDetails.title}
            filters ={{
              color: filters.color || {size:'3', palete:'op_1'},
              isGradient: filters.isGradient !== undefined ? filters.isGradient : true,
              minWeight: filters.minWeight || 0,
              topSentencesCount:21
            }}/>

}