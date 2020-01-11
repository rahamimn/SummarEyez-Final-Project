import React from 'react';

export const ArticleViewer = ({json,type}) => {
    let paragraphs = [];
    let paragraphNum = -1;


    for(let i = 0 ; i < json.length; i++){
        const sent = <span key={'sent'+i} style={{backgroundColor:`hsl(90, 100%, ${json[i].weight*100 < 20 ? 1 : json[i].weight*100 }%)`}} >{json[i].text}</span>
        if(json[i].par_num !== paragraphNum){
            paragraphs.push([sent]);
            paragraphNum = json[i].par_num;
        }
        else{
            paragraphs[paragraphNum-1].push([sent])
        }
    }

    const sentHtml = paragraphs.map((sents,i) => <p key={'par'+i}>{sents}</p>);

    return <div style={{
        backgroundColor: 'white',
        width:'800px',
        textAlign:'left',
        color: 'black',
        fontSize: '16px',
        display:'flex',
        justifyContent: 'center',
    }}> <div style={{ width:'700px'}}>{sentHtml}</div> </div>
}

