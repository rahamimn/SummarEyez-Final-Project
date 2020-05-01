import React, {useState} from 'react';
import { TextField, Popper, Card, Button } from '@material-ui/core';
import { BaseViewer } from '../BaseViewer/BaseViewer';
export const RankSentences = ({
    rankSentences,
    setRankSentences
}) => {
    
    const SentPopper = ({weight, isOpen, id, anchorEl, sentIndex}) => {
        const [val,setVal] = useState(weight);
        return (
        <Popper id={id} open={isOpen} anchorEl={anchorEl}>
            <Card elevation={5} style={{padding:'5px 10px', display:'flex', alignItems:'center'}}>
                <TextField 
                    style={{width:'180px', marginBottom:'15px'}}
                    inputProps={{min:0,max:1, step:0.1}}
                    type="number"
                    value={val}
                    onChange={(e) => {
                        setVal(e.target.value);
                    }}
                    id="minimumWeight"
                    label="minimum weight" />
                <Button onClick={
                        () => {
                            rankSentences[sentIndex].weight = val
                            rankSentences[sentIndex].normalized_weight = val;
                            setRankSentences([...rankSentences])
                    }}> Ok</Button>
            </Card>
        </Popper>)};
    

    return (
    <div style={{width:'800px'}}>
        <BaseViewer
            SentPopper = {SentPopper}
            summary={rankSentences}
            title={'Rank Sentences'}
            filters={{
                color: {size:'3', palete: 'op_1'},
                isGradient: true,
                minWeight: 0,
        }}/>
    </div>
    )}

