import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import ToggleButton from '@material-ui/lab/ToggleButton';
import {BaseViewer} from '../BaseViewer/BaseViewer';
import { Card, Popper, Select, Input, MenuItem, ListItemText } from '@material-ui/core';
import { COLORS_SIZES, COLORS } from '../colors';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 5.5 + ITEM_PADDING_TOP,
      width: 330,
    },
  },
};

const FilterRow = ({children, text}) => <div style={{
        display:'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin:'10px 0'
    }}>
        <Typography color="textSecondary">{text}</Typography>
        {children}
    </div>

const paleteColors = (colors) => <div style={{display:'flex',justifyContent: 'center'}}>
    {colors.map((color,ind) => <div key={`col-${ind}`} style={{height:'30px', width:'30px', backgroundColor: color}}></div>)}
</div>

export const ArticleViewer = ({summary, title}) => {

    let [color, setColor] = useState({
        colorSize: '5',
        colorPalete:'op_1'
    });

    let [minWeight, setMinWeight] = useState(0);
    let [hideUnderMin, setHideUnderMin] = useState(false);
    let [topSentencesCount, setTopSentencesCount ] = useState(summary.length);

    useEffect(() => {
        setTopSentencesCount(summary.length)
    },[summary]);

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
                    <FilterRow text="#Colors">
                        <Select
                            labelId="select-color-sizes"
                            id="select-#colors"

                            value={color.colorSize}
                            onChange={(event) => {
                                const colorSizeVal = event.target.value;
                                setColor({
                                    colorSize: colorSizeVal,
                                    colorPalete: Object.keys(COLORS[colorSizeVal])[0]
                                });
                            }}
                            input={<Input style={{display:'block', width:'100px'}}/>}
                            renderValue={(selected) => selected}
                            MenuProps={MenuProps}
                        >
                            {COLORS_SIZES.map((size) => (
                                <MenuItem key={size} value={size}>
                                    <ListItemText primary={size} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FilterRow>
                    <FilterRow text="Palete">
                        <Select
                            labelId="select-color-sizes"
                            id="select-#colors"

                            value={color.colorPalete}
                            onChange={(event) => 
                                setColor({
                                    colorSize: color.colorSize,
                                    colorPalete: event.target.value
                                })
                            }
                            input={<Input style={{display:'block', width:'100px'}}/>}
                            renderValue={(selected) => selected}
                            MenuProps={MenuProps}
                        >
                            { Object.keys(COLORS[color.colorSize]).map((palete) => (
                                <MenuItem key={palete} value={palete}>
                                    <ListItemText primary={palete} />
                                    {paleteColors(COLORS[color.colorSize][palete])}
                                </MenuItem>
                            ))}
                        </Select>
                    </FilterRow>
                    
                    <div style={{marginTop:'10px', marginBottom:'20px'}}>
                        {paleteColors(COLORS[color.colorSize][color.colorPalete])}
                    </div>
                    <TextField 
                        style={{width:'180px', marginBottom:'15px'}}
                        inputProps={{min:0,max:1, step:0.1}}
                        type="number"
                        value={minWeight}
                        onChange={(e) => {
                            const {value} = e.target;
                            if(value >= 0 && value <= 1){
                                setMinWeight(value)
                            }
                        }}
                        id="minimumWeight"
                        label="minimum weight" />
                    

                    <TextField 
                        style={{width:'180px', marginBottom:'15px'}}
                        inputProps={{min:0, max:summary.length, step:1}}
                        type="number"
                        value={topSentencesCount}
                        onChange={(e) => {
                            const {value} = e.target;
                            if(value >= 0 && value < summary.length){
                                setTopSentencesCount(value)
                            }
                        }}
                        id="minimumWeight"
                        label="Top Sentences"/>

                    <FilterRow text="Hide Sentence">
                        <ToggleButton
                            value="check"
                            selected={hideUnderMin}
                            onChange={() => {
                                setHideUnderMin(!hideUnderMin);
                            }}
                            >
                            <CheckIcon />
                        </ToggleButton>
                    </FilterRow>

                    
                </div>
                <div style={{width:'800px'}}>
                    <BaseViewer
                        SentPopper = {SentPopper}
                        summary={summary}
                        title={title}
                        filters={{
                            color: color && {size: color.colorSize, palete: color.colorPalete},
                            hideUnderMin,
                            minWeight,
                            topSentencesCount
                        }}/>
                </div>
        </div>       
}

const SentPopper = ({weight, isOpen, id, anchorEl}) => <Popper id={id} open={isOpen} anchorEl={anchorEl}>
    <Card elevation={5} style={{padding:'5px 10px'}}>
        weight is {weight}
    </Card>
</Popper>

