import React, {useState} from 'react';
import Button from '@material-ui/core/Button'

export const ArticleViewer = ({json,type}) => {
    let paragraphs = [];
    let paragraphNum = -1;
    let [color, setColor] = useState(90)

    for(let i = 0 ; i < json.length; i++){
        // const sent = <span key={'sent'+i} style={{backgroundColor:`hsl(90, 100%, ${100 - json[i].weight*50}%)`}} >{json[i].text}</span>
        const sent = <span key={'sent'+i} style={{backgroundColor:`hsl(${color}, 100%, ${100 - json[i].weight*50}%)`}} >{json[i].text}</span>
        
        if(json[i].par_num !== paragraphNum){
            paragraphs.push([sent]);
            paragraphNum = json[i].par_num;
        }
        else{
            paragraphs[paragraphNum-1].push([sent])
        }
    }

    const sentHtml = paragraphs.map((par,i) => <p key={'par'+i}>{par}</p>);

    return <div>
            <Button onClick={() => setColor(90)}>yellow</Button>
            <Button onClick={() => setColor(35)}>red</Button>
            <Button onClick={() => setColor(200)}>blue</Button>
            <div style={{
                backgroundColor: 'white',
                border: '1px solid black',
                width:'800px',
                textAlign:'left',
                color: 'black',
                fontSize: '16px',
                display:'flex',
                justifyContent: 'center',
            }}>
       
                <div style={{ width:'700px', fontFamily: '"Times New Roman", Times, serif', fontWeight:'400'}}>{sentHtml}</div> </div>
        </div>
}

