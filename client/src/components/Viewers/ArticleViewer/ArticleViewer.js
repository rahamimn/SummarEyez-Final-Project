import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete';
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
    {colors.map(color => <div style={{height:'30px', width:'30px', backgroundColor: color}}></div>)}
</div>

export const ArticleViewer = ({summary, title}) => {
    // let [colorInput, setColorInput] = useState('');
    // let [color, setColor] = useState(90);
    let [colorSize, setColorSize] = useState('5');
    let [colorPalete, setColorPalete] = useState('op_1');
    let [isGradient, setIsGradient] = useState(true);
    let [minWeight, setMinWeight] = useState(0);
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

                            value={colorSize}
                            onChange={(event) => setColorSize(event.target.value)}
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

                            value={colorPalete}
                            onChange={(event) => setColorPalete(event.target.value)}
                            input={<Input style={{display:'block', width:'100px'}}/>}
                            renderValue={(selected) => selected}
                            MenuProps={MenuProps}
                        >
                            { Object.keys(COLORS[colorSize]).map((palete) => (
                                <MenuItem key={palete} value={palete}>
                                    <ListItemText primary={palete} />
                                    {paleteColors(COLORS[colorSize][palete])}
                                </MenuItem>
                            ))}
                        </Select>
                    </FilterRow>
                    <FilterRow text="Gradient">
                        <ToggleButton
                            value="check"
                            selected={isGradient}
                            onChange={() => {
                                setIsGradient(!isGradient);
                            }}
                            >
                            <CheckIcon />
                        </ToggleButton>
                    </FilterRow>
                    <div style={{marginTop:'10px', marginBottom:'20px'}}>
                        {paleteColors(COLORS[colorSize][colorPalete])}
                    </div>
                    
                    {/* <Autocomplete
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
                    /> */}
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

                    
                </div>
                <div style={{width:'800px'}}>
                    <BaseViewer
                        SentPopper = {SentPopper}
                        summary={summary}
                        title={title}
                        filters={{
                            color: {size:colorSize, palete: colorPalete},
                            isGradient,
                            minWeight,
                            topSentencesCount
                        }}/>
                </div>
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

