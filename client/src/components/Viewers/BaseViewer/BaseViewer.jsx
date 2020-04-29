import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { COLORS } from '../colors';


export const BaseViewer = ({
    SentPopper,
    summary,
    title,
    filters}) => {
    const { color,
            isGradient,
            minWeight,
            topSentencesCount } = filters;
    
    let paragraphs = [];
    let paragraphNum = -1;

    const [selectedSent,setSelectedSent] = useState(null); 
    const [anchorEl,setAnchorEl] = useState(null);
    
    const colorSize = parseInt(color.size);
    const colorsArray = COLORS[color.size][color.palete];


    const sortedSentences = [...summary].sort((a,b) => b.normalized_weight - a.normalized_weight);
    const topSentences = sortedSentences.slice(0,topSentencesCount);

    // const backgroundColorOld = (sent) =>  (sent.normalized_weight > minWeight && topSentences.includes(sent)) ? 
    //     (isGradient? `hsl(${color}, 100%, ${100 - sent.normalized_weight*50}%)` :
    //     `hsl(${color}, 100%, 50%)` ) :
    //         null;

    const backgroundColor = (sent) =>  
    (sent.normalized_weight >= minWeight && topSentences.includes(sent)) ? 
        (isGradient ? 
            (
                parseInt(sent.normalized_weight) === 1 ?
                    colorsArray[colorSize-1]:
                    colorsArray[Math.floor(sent.normalized_weight * colorSize)]
            ) :
            colorsArray[Math.floor(colorSize/2)]):
        null;

    for(let i = 0 ; i < summary.length; i++){
        const isSamePar = summary[i].par_num === paragraphNum;
        const Sent = (
           <span>
                <span 
                    aria-describedby={'sent-'+i}
                    onClick={(event) => {
                        if(selectedSent === i){
                            setAnchorEl(null)
                            setSelectedSent(null)
                        }
                        else{
                            setAnchorEl(event.currentTarget);
                            setSelectedSent(i)
                        }
                        
                    }}
                    key={'sent'+i}
                    style={{backgroundColor: backgroundColor(summary[i])}}>
                        {isSamePar && <span>&nbsp;</span>}
                        {summary[i].text}
                </span>
                {SentPopper &&  <SentPopper id={'sent-'+i} weight={summary[i].normalized_weight} anchorEl={anchorEl} isOpen={selectedSent === i}/>}
            </span>
        );
        
        if(!isSamePar){
            paragraphs.push([Sent]);
            paragraphNum = summary[i].par_num;
        }
        else{
            paragraphs[paragraphNum-1].push(Sent)
        }
    }

    const sentHtml = paragraphs.map((par,i) => <p key={'par'+i}>{par}</p>);

    return <div style={{ 
        // width:'800px',
        fontSize: '19px',
        padding:'50px',
        fontFamily: '"Times New Roman", Times, serif', fontWeight:'400'}}>
        <strong><div style={{fontSize:"30px"}}>{title}</div></strong>
        {sentHtml}
    </div>      
}


const colors = [{
    id:'yellow',
    value: 90,
},
{
    id:'red',
    value: 35,
},
{
    id:'blue',
    value: 200,
},
{
    id:'adir confused1',
    value: 260,
},
{
    id:'adir confused2',
    value: 150,
},
{
    id:'adir confused3',
    value: 15,
}];
