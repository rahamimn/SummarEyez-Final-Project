  
import React, {useState, useMemo} from 'react';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import { Typography, Button } from '@material-ui/core';

function IndexAns ({index, selected}){
  return <div style={{
      backgroundColor: selected ? '#303030':'#ebebed',
      borderRadius:'15%',
      display:'flex',
      alignItems:'center',
      justifyContent:'center',  
      width:'50px',
      height:'60px',
      color: selected && 'white',
      marginRight:'13px'
      }}>{index}</div>
}
export function Question({
    question,
    onNext,
}) {
  const [selected,setSelected] = useState(null);


  const time = useMemo(() => Date.now(),[question]);

  const onNextQuestion = () => {
    onNext(selected, Date.now()-time)
    setSelected(null)
  }
  return (
    <Card style={{ 
      padding:'20px',
      minWidth:'500px'}}>
     
      <Typography style={{marginBottom:'15px'}}>{question.question}</Typography>
      {
        question.answers.map((ans,i) =>{
        const index = i+1;
        return (
          <Paper
            id={`question-ans-${index}`}
            key={`ans-${index}`} 
            style={{
              minHeight:'55px',
              margin:'10px 0',
              padding:'5px 5px 5px 15px',
              display:'flex',
              alignItems:'center',
              backgroundColor: !onNext && question.correctAnswer === `${index}` && '#CCFFE5'
            }}
            elevation={selected === index ? 5 : 1 }
            onClick={() => onNext && setSelected(index)}>
              <IndexAns 
                index={index}
                selected={selected === index}
              />
              <Typography>{ans}</Typography>
      
          </Paper>
        )})
      }
      {onNext && <div style={{float:'right'}}>
        <Button 
          id="question-next"
          variant="contained"
          onClick={onNextQuestion}
          disabled={selected === null}>
          Next
        </Button>
        
      </div>
      }
      {!onNext && <Typography style={{fontSize:'10px', marginBottom:'15px'}}>{question.id}</Typography>}
    </Card>
  );
}
  
