import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';
import { Popper, Card } from '@material-ui/core';


const SmallCircle  = ({color}) => <span style={{
    display:'inline-block',
    width:'10px',
    height:'10px',
    borderRadius:'50%',
    backgroundColor:`hsl(${color}, 100%, 75%)`,
    marginRight:'5px',
}}></span>


export const LayersViewer = ({summaries, title, summariesMetadata, experimentName }) => {

    const summaryDetail = (metaData, index) => (
        <div key={index} style={{marginBottom: "40px"}}>
            <div style={{display:"flex", alignItems: "center"}}>
                <div style={{ marginRight:"10px",height:"30px", width:"50px", backgroundColor:`hsl(${colors[index].value}, 100%, 75%)`}}></div>
                <Typography>{metaData.name}({metaData.type})</Typography>
            </div>
            <Button 
                size="small"  
                onClick={() => window.open(`/article/${experimentName}/${metaData.type}/${metaData.name}`,'_blank')}>
                    Go to Summary
            </Button>
        </div>
    );

    const SentPopper = ({weights, isOpen, anchorEl}) => (
        <Popper open={isOpen} anchorEl={anchorEl}>
            <Card elevation={5} style={{padding:'5px 10px'}}>
                {weights.map((weight,i)=> 
                    <div><SmallCircle color={colors[i].value}/>({summariesMetadata[i].name}) {weight}</div>
                )}
            </Card>
        </Popper>
    );

    let paragraphs = [];
    let paragraphNum = -1;

    let [minWeight, setMinWeight] = useState(0);
    const [selectedSent,setSelectedSent] = useState(null); 
    const [anchorEl,setAnchorEl] = useState(null);

    const backgroundColor = (sentIndex, sent) =>  {
        const color = summaries.reduce((prevColor,summary,index) => {
            const sent = summary[sentIndex];
            return  sent.normalized_weight > minWeight ? prevColor + colors[index].value : prevColor
        } ,0);

        if(color === 0){
            return null;
        }

        return `hsl(${color}, 100%, 75%)`;
    };

    for(let i = 0 ; i < summaries[0].length; i++){
        const isSamePar = summaries[0][i].par_num === paragraphNum;
        
        const Sent = (
            <span>
                <span 
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
                    style={{backgroundColor: backgroundColor(i, summaries[0][i])}}>
                        {isSamePar && <span>&nbsp;</span>}
                        {summaries[0][i].text}
                </span>
                <SentPopper 
                    weights={summaries.map(summary => summary[i].normalized_weight)} 
                    anchorEl={anchorEl} 
                    isOpen={selectedSent === i}  />
            </span>
        );
        
        if(!isSamePar){
            paragraphs.push([Sent]);
            paragraphNum = summaries[0][i].par_num;
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
                    width: '190px',
                    backgroundColor:'#dddddd'
                    }}>
                    <Typography variant="h5" style={{marginBottom:'20px'}}>
                        Filters
                    </Typography>
                    
                    <TextField 
                        style={{width:'180px', marginBottom:'15px'}}
                        inputProps={{min:0,max:1, step:0.1}}
                        type="number"
                        value={minWeight}
                        onChange={(e) =>{ 
                            const {value} = e.target;
                            if(value >= 0 && value <= 1){
                                setMinWeight(value)
                            }
                        }}
                        id="minimumWeight"
                        label="minimum weight" />
                    <Typography variant="h5" style={{marginBottom:'20px', marginTop:'20px'}}>
                        Summaries
                    </Typography>
                    {summariesMetadata.map((summary,index) => summaryDetail(summary, index))}



                </div>
                <div style={{ 
                    width:'800px',
                    padding:'50px',
                    fontFamily: '"Times New Roman", Times, serif', fontWeight:'400'}}>
                    <strong><div style={{fontSize:"30px"}}>{title}</div></strong>
                    {sentHtml}
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



