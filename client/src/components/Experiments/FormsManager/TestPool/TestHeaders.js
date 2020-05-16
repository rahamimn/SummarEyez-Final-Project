import React from 'react';
import { Button } from '@material-ui/core';
import {saveAs} from 'save-as';
 
export const testsHeadersDefault = [
    { id: 'name', label: 'Test Id/Name'},
    { id: 'creation_date', label: 'Creation Date', type:'date' },
    { id: 'formId', label: 'Form Name' },
];
  
export const createHeadersFromForm = (form, experimentName) => {
  let headers = [...testsHeadersDefault];
  if(form.isFillAnswers){
    headers = [...headers, ...form.questionIds.map((id,ind) => ({ 
        id: 'answers',
        label: `Q${ind}`,
        index: ind,
        type:'array',
        format: (answer) =>`${answer.ans} ~${answer.time/1000}~` })
      ), 
      { id: 'score', label: 'Score' },
    ];
    if(form.withFixations){
      headers.push({ id: 'name', label: 'fixations-summary', type: 'custom', format: (name) => <Button onClick={() => window.open(`/article/${experimentName}/eyes/${name}`,'_blank')}>view</Button> })
    }
    if(form.isRankSentences){
      headers.push({ id: 'sentanceWeights', label: 'rank-sentences', type: 'custom', format: (sentanceWeights) => <Button onClick={() => saveAs(new Blob([JSON.stringify(sentanceWeights)]), 'weights.json')}> download </Button> });
    }
  }
  return headers;
}