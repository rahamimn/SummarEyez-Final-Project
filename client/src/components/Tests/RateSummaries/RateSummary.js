  
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
      <div style={{display:'flex', flexDirection: 'column' }}>
          <SummaryTumbnail
            experimentName={form.experimentName} 
            summary={form.summary}
          />
          <div>
            <Paper variant="outlined" style={{display:'flex', alignItems:'center' ,backgroundColor: needRating && '#f9f8dd'}}>
              <Slider style={{margin:'10px 0 10px 10px'}} value={usingRate} min={0} max={10} onChange={(e,v)=> setRate(v) }/>
              <div style={{width:'40px', textAlign:'center'}}>
                <Typography>{usingRate}</Typography>
              </div>
            </Paper>
          </div>
      </div>
    </div>
  );
}
  
