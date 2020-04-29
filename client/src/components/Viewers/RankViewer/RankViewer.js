import React, {useState} from 'react';
import { TextField, Popper, Card } from '@material-ui/core';
import { BaseViewer } from '../BaseViewer/BaseViewer';
export const RankSentences = ({
    rankSentences,
    setRankSentences
}) => {
    
    const SentPopper = ({weight, isOpen, id, anchorEl, sentIndex}) => (
    <Popper id={id} open={isOpen} anchorEl={anchorEl}>
        <Card elevation={5} style={{padding:'5px 10px'}}>
            <TextField 
                style={{width:'180px', marginBottom:'15px'}}
                inputProps={{min:0,max:1, step:0.1}}
                type="number"
                value={weight}
                onChange={(e) => {
                    rankSentences[sentIndex].weight = e.target.value;
                    rankSentences[sentIndex].normalized_weight = e.target.value;
                    setRankSentences([...rankSentences]);
                }}
                id="minimumWeight"
                label="minimum weight" />
        </Card>
    </Popper>)
    ;

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

