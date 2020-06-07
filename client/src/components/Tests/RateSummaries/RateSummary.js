  
import React, {useState} from 'react';
import { Typography, Button,Divider, Slider, Paper } from '@material-ui/core';
import { SummaryTumbnail } from './SummaryThumbnail';

export function RateSummary({
    form,
    rate,
    setRate
}) {
  const needRating = rate === -1;
  const usingRate = rate > -1 ? rate : 0;

  return (
    <div style={{margin:'20px'}}>
      <Typography>{needRating ? 'please Rate': ' rated'}</Typography>
      <div style={{display:'flex', alignItems: 'center', flexDirection: 'column' }}>
        
          <SummaryTumbnail
            experimentName={form.experimentName} 
            summary={form.summary}
          />
          <div style={{display:'flex'}}>
            <Slider style={{width:'250px', margin: '10px'}} value={usingRate} min={0} max={10} onChange={(e,v)=> setRate(v) }/>
            <Paper variant="outlined" style={{width:'40px', display:'flex', justifyContent:'center', alignItems:'center'}}>
              <Typography>{usingRate}</Typography>
            </Paper>
          </div>
      </div>
    </div>
  );
}
  
