  
import React, {useState} from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { RateSummary } from './RateSummary';

export function RateSummaries({
    text,
    forms,
    onNext
}) {

  const formsMapping = (form) => form.isReadSummary && {
    formName: form.name,
    experimentName: form.experimentName,
    summary: form.summary,
    rate: -1
  };
  
  const [summariesRate,setSummariesRate] = useState(forms.map(formsMapping))
  const disabledNext = summariesRate.some(o => o !== null && o.rate === -1);

  return (
  <div style={{width:'970px'}}>
        <Typography variant="h5">For each of the following summaries,<br></br> Please rate from 1 to 10 how helpful the summary was to you:</Typography>
        <Divider/>
        <div style={{display:'flex', flexWrap:'wrap', marginTop:'20px'}}>
            {forms
              .map((form,i) => form.isReadSummary ? (
                  <div key={`rate-${i}-123`} style={{margin:'10px'}}>
                   <RateSummary
                      form={form}
                      rate={summariesRate[i].rate}
                      setRate={ (rate) =>
                        {
                          summariesRate[i] = {
                            ...summariesRate[i],
                            rate
                          };
                          setSummariesRate([
                            ...summariesRate
                          ]);
                        }
                      }
                  />
                </div>) : null).filter( x => x)
            }
        </div>
        <div style={{display:'flex', justifyContent:'flex-end'}}>
          <Button disabled={disabledNext} onClick={() => onNext(summariesRate)}>
            next
          </Button>
        </div>
    </div>
  );
}
  
