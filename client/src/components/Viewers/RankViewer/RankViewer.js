import React, {useState} from 'react';
import { TextField, Popper, Card, Button } from '@material-ui/core';
import { BaseViewer } from '../BaseViewer/BaseViewer';
export const RankSentences = ({
    rankSentences,
    setRankSentences
}) => {
    
    const SentPopper = ({weight, isOpen, id, anchorEl, sentIndex, close}) => {
        const [val,setVal] = useState(weight);
        return (
        <Popper id={id} open={isOpen} anchorEl={anchorEl}>
            <Card elevation={5} style={{padding:'5px 10px', display:'flex', alignItems:'center'}}>
                <TextField 
                    style={{width:'180px', marginBottom:'15px'}}
                    inputProps={{
                        min:0,
                        max:1,
                        step:0.1,
                    }}
                    type="number"
                    value={val}
                    onChange={(e) => {
                        const {value} = e.target;
                        if(value >= 0 && value <= 1){
                            setVal(value);
                        }
                    }}
                    id="minimumWeight"
                    label="minimum weight" />
                <Button
                    id="ok-minimum-weight"
                    onClick={
                        () => {
                            rankSentences[sentIndex].weight = val
                            rankSentences[sentIndex].normalized_weight = val;
                            setRankSentences([...rankSentences])
                            close()
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
                color: {size:'10', palete: 'Green'},
                hideUnderMin: false,
                minWeight: 0,
        }}/>
    </div>
    )}

