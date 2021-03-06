import React, {useState} from 'react';
import { COLORS } from '../colors';


export const BaseViewer = ({
    SentPopper,
    summary,
    title,
    filters,
    thumbnail = false
}) => {
    const { color,
            hideUnderMin,
            minWeight,
            topSentencesCount } = filters;
    
    let paragraphs = [];
    let paragraphNum = -1;

    const [selectedSent,setSelectedSent] = useState(null); 
    const [anchorEl,setAnchorEl] = useState(null);
    

    const colorSize = color && parseInt(color.size);
    const colorsArray = color && COLORS[color.size][color.palete];


    const sortedSentences = [...summary].sort((a,b) => b.normalized_weight - a.normalized_weight);
    const topSentences =  topSentencesCount ? sortedSentences.slice(0,topSentencesCount) : sortedSentences;

    const backgroundColor = (sent) =>  
    (sent.normalized_weight >= minWeight && topSentences.includes(sent)) ? 
        (parseInt(sent.normalized_weight) === 1 ?
            colorsArray[colorSize-1]:
            colorsArray[Math.floor(sent.normalized_weight * colorSize)]
        ) :
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
                    style={{
                        visibility: summary[i].normalized_weight < minWeight && hideUnderMin? 'hidden': 'visible',
                        backgroundColor: color && backgroundColor(summary[i]),
                        textDecoration: i === selectedSent && !thumbnail && 'underline'}}>
                        {isSamePar && <span>&nbsp;</span>}
                        {summary[i].text}
                </span>
                {SentPopper &&  <SentPopper id={'sent-'+i} 
                    sentIndex={i}
                    weight={summary[i].normalized_weight}
                    anchorEl={anchorEl}
                    isOpen={selectedSent === i}
                    close={() => setSelectedSent(null) }/>}
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
        fontSize: thumbnail? '4p': '19px',
        padding: thumbnail? '0' : '50px',
        fontFamily: '"Times New Roman", Times, serif', fontWeight:'400'}}>
        <strong><div style={{fontSize:"30px"}}>{title}</div></strong>
        {sentHtml}
    </div>      
}


