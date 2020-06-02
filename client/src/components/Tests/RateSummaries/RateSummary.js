  
import React, {useState} from 'react';
import { Typography, Button,Divider, Slider, Paper } from '@material-ui/core';
import { SummaryTumbnail } from './SummaryThumbnail';

export function RateSummary({
    form,
    onNext
}) {
  const [rate,setRate] = useState(0);

  return (
    <div style={{width: '500px'}}>
        <Typography variant="h4">Rate The Summary</Typography>
        <Divider/>
        <div style={{ margin:'20px', display:'flex', alignItems: 'center', flexDirection: 'column' }}>
            <SummaryTumbnail
              experimentName={form.experimentName} 
              summary={form.summary}
            />
            <div style={{display:'flex'}}>
              <Slider style={{width:'250px', margin: '10px'}} value={rate} min={0} max={10} onChange={(e,v)=>setRate(v)}/>
              <Paper variant="outlined" style={{width:'40px', display:'flex', justifyContent:'center', alignItems:'center'}}>
                <Typography>{rate}</Typography>
              </Paper>
            </div>
        </div>
        <div style={{display:'flex', justifyContent:'flex-end'}}>
          <Button disabled={!rate} onClick={() => onNext(rate)}>
            next
          </Button>
        </div>
    </div>
  );
}
  
