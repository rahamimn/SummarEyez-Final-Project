  
import React, {useState, useMemo, useEffect} from 'react';
import { Typography, Button, Dialog, CardActions, Divider } from '@material-ui/core';
import { QuizViewer } from '../../Viewers/quizViewer/quizViewer';
import { SummaryTumbnail } from './SummaryThumbnail';

export function ChooseSummary({
    text,
    forms,
    onNext
}) {
  const [selected,setSelected] = useState(null);

  useEffect(() => setSelected(null) ,[text]);

  const genOnSelect = form => () => setSelected(form);

  return (
  <div style={{width:'970px'}}>
        <Typography variant="h4">{text}</Typography>
        <Divider/>
        <div style={{display:'flex', flexWrap:'wrap', marginTop:'20px'}}>
            {forms
              .filter(form => form.isReadSummary)
              .map(form => (
                <div style={{margin:'10px'}}>
                  <SummaryTumbnail
                  selected={selected && form.name === selected.name}
                  experimentName={form.experimentName} 
                  summary={form.summary}
                  onSelect={genOnSelect(form)}
                  />
                </div>)
              )
            }
        </div>
        <div style={{display:'flex', justifyContent:'flex-end'}}>
          <Button disabled={!selected} onClick={() => onNext(selected)}>
            next
          </Button>
        </div>
    </div>
  );
}
  
