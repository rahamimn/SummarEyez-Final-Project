  
import React, {useState, useMemo} from 'react';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import { Typography, Button, Dialog, CardActions } from '@material-ui/core';
import { QuizViewer } from '../../Viewers/quizViewer/quizViewer';

export function SummaryTumbnail({
    summary,
    experimentName,
    selected,
    onSelect,
}) {
  const [showModal,setShowModal] = useState(false);

  return (
    <Card variant="outlined" style={{ 
      padding:'5px',
      width:'210px',
      backgroundColor:selected && '#dedede'
      }}>

      <div style={{
        fontSize:'4px',      
        height:'290px',
        overflowY: 'hidden'
        }}>
        <QuizViewer
          thumbnail
          experimentName={experimentName}
          type={summary.type}
          name={summary.name}
          filters={summary.filters}
        />
      </div>
     
      <Dialog maxWidth='md' open={showModal} onClose={() => setShowModal(false)}>	
        
				<QuizViewer
          experimentName={experimentName}
          type={summary.type}
          name={summary.name}
          filters={summary.filters}
        />
			</Dialog>
      <CardActions>
        <Button onClick={() => setShowModal(true)}>Show</Button>
        {onSelect && <Button onClick={() => onSelect()}>Select</Button>}
      </CardActions>
    </Card>
  );
}
  
