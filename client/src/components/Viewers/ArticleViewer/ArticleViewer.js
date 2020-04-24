import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import ToggleButton from '@material-ui/lab/ToggleButton';
import {BaseViewer} from '../BaseViewer/BaseViewer';
import { Card, Popper } from '@material-ui/core';

export const ArticleViewer = ({summary, title}) => {
    let paragraphs = [];
    let paragraphNum = -1;
    let [colorInput, setColorInput] = useState('');
    let [color, setColor] = useState(90);
    let [isGradinet, setIsGradient] = useState(true);
    let [minWeight, setMinWeight] = useState(0);
    let [topSentencesCount, setTopSentencesCount ] = useState(summary.length);

    useEffect(() => {
        setTopSentencesCount(summary.length)
    },[summary]);

    const sortedSentences = [...summary].sort((a,b) => b.normalized_weight - a.normalized_weight);
    const topSentences = sortedSentences.slice(0,topSentencesCount);
    const backgroundColor = (sent) =>  (sent.normalized_weight > minWeight && topSentences.includes(sent)) ? 
        (isGradinet? `hsl(${color}, 100%, ${100 - sent.normalized_weight*50}%)` :
        `hsl(${color}, 100%, 50%)` ) :
            null;

    for(let i = 0 ; i < summary.length; i++){
        const isSamePar = summary[i].par_num === paragraphNum;
        const Sent = (
            <span 
                key={'sent'+i}
                style={{backgroundColor: backgroundColor(summary[i])}}>
                    {isSamePar && <span>&nbsp;</span>}
                    {summary[i].text}
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
                backgroundColor: 'white',
                textAlign:'left',
                color: 'black',
                fontSize: '19px',
                display:'flex',
                justifyContent: 'center',
            }}>
                <div style={{
                    display:'flex',
                    flexDirection:'column',
                    padding:'30px',
                    backgroundColor:'#dddddd',
                    width: '190px',
                    }}>
                    <Typography variant="h5" style={{marginBottom:'20px'}}>
                        Filters
                    </Typography>
                    
                    <Autocomplete
                        id="color-select"
                        style={{ width: '180px', marginRight:10, marginBottom:'15px' }}
                        options={colors}
                        autoHighlight
                        getOptionLabel={option => option.id}
                        renderInput={params => (
                            <TextField
                            {...params}
                            label="Choose a color"
                            fullWidth
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'disabled', // disable autocomplete and autofill
                            }}
                            />
                        )}
                        onChange={(e,color) => 
                            setColor(color.value)
                        }
                        onInputChange={(e, value) => 
                            setColorInput(value)
                        }
                        inputValue={colorInput}
                    />
                    <TextField 
                        style={{width:'180px', marginBottom:'15px'}}
                        inputProps={{min:0,max:1, step:0.1}}
                        type="number"
                        value={minWeight}
                        onChange={(e) => setMinWeight(e.target.value)}
                        id="minimumWeight"
                        label="minimum weight" />

                    <TextField 
                        style={{width:'180px', marginBottom:'15px'}}
                        inputProps={{min:0,max:summary.length, step:1}}
                        type="number"
                        value={topSentencesCount}
                        onChange={(e) => setTopSentencesCount(e.target.value)}
                        id="minimumWeight"
                        label="Top Sentences" />
                    <div style={{
                        display:'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Typography color="textSecondary">Gradient</Typography>
                        <ToggleButton
                            value="check"
                            selected={isGradinet}
                            onChange={() => {
                                setIsGradient(!isGradinet);
                            }}
                            >
                            <CheckIcon />
                        </ToggleButton> 
                    </div>
                </div>
                <BaseViewer
                    SentPopper = {SentPopper}
                    summary={summary}
                    title={title}
                    filters={{
                        color,
                        isGradinet,
                        minWeight,
                        topSentencesCount
                    }}/>
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


const SentPopper = ({weight, isOpen, id, anchorEl}) => <Popper id={id} open={isOpen} anchorEl={anchorEl}>
    <Card elevation={5} style={{padding:'5px 10px'}}>
        weight is {weight}
    </Card>
</Popper>

