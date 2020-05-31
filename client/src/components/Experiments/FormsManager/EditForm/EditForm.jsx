import React,{useState,useEffect, useCallback, useMemo} from 'react';
import { Typography, Grid, Card, TextField, Button, Divider, Select, MenuItem, Checkbox, ListItemText, Input, Switch, Paper, IconButton } from '@material-ui/core';
import { QuizViewer } from '../../../Viewers/quizViewer/quizViewer';
import api from '../../../../apiService';
import { Question } from '../../../Tests/FormView/QuizView/QuestionView/Question';
import { ERROR_STATUS } from '../../../ERRORS';
import { AddQuestion } from '../AddQuestion/AddQuestion';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ToggleButton from '@material-ui/lab/ToggleButton';
import CheckIcon from '@material-ui/icons/Check';
import { COLORS_SIZES, COLORS } from '../../../Viewers/colors';
import CloseIcon from '@material-ui/icons/Close';

const emptyForm = {
    name:'',
    questionIds:[],
    isRankSentences: false,
    isFillAnswers: false,
    isReadSummary: false,
    withFixations: false,
    summary: { filters:{ 
      hideUnderMin: false,
      color:{size:'3', palete:'op_1'}}},
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 5.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const paleteColors = (colors) => <div style={{display:'flex',justifyContent: 'center'}}>
    {colors.map((color,i) => <div key={`color-${i}`} style={{height:'30px', width:'30px', backgroundColor: color}}></div>)}
</div>

export function EditForm({
    onSave,
    onClose,
    form,
    experimentName
    }){
      const [formNameExists, setFormNameError] = useState(false);
      const [questionsError, setQuestionsError] = useState(false);
      const [addQuestion, setAddQuestion] = useState(false);
      const [summaryError, setSummaryError] = useState(false);
      const [questions, setQuestions] = useState([]);
      const [summaries, setSummaries] = useState({
          auto: [],
          eyes: [],
          merged: []
      });
      const [question,setQuestion] = useState(null);
      const [isFetchingData,setIsFetchingData] = useState(false);
      const [summaryNameText, setSummaryNameText] = useState('');
      const [summaryTypeText, setSummaryTypeText] = useState('');
      const [formDTO,setFormDTO] = useState(form || emptyForm);
  
      const updateField = useCallback((name, value) => setFormDTO({...formDTO,[name]: value }),[formDTO]);
      const disabled = form && !form.editable;

      const fetchQuestions = useCallback(async() => { 
        const {data} = await api.getQuestions(experimentName);
        //Handle status
        setQuestions(data);
        return data;
      },[experimentName]);

      const fetchSummaries = useCallback(async() => {
        const {data} = await api.getSummaries(experimentName);
        //Handle status
        setSummaries(data);
        return data;
      },[experimentName]);

      const fetchData = useCallback(async() => {
        setIsFetchingData(true);
        await fetchQuestions();
        await fetchSummaries();
        setIsFetchingData(false);
      },[ fetchQuestions, fetchSummaries]);
  
      useEffect(() =>{ 
        experimentName && fetchData()
      },[experimentName, fetchData]);
  
      useEffect(() => {
          
        if(form){
          setFormDTO(form)
          const {summary} =  form;
          setSummaryNameText(summary ? summary.name: '');
          setSummaryTypeText(summary ? form.summary.type: '');
        }
        else{
          setFormDTO(emptyForm);
          setSummaryNameText('');
          setSummaryTypeText('');
        }
        setFormNameError(false);
        setQuestionsError(false);
        setSummaryError(false);
      },[form]);
  
      const onClickSave = useCallback( async () => {
        const {isReadSummary, name, summary, isFillAnswers, questionIds} = formDTO;
        let status;
        let err = false;
        //verify
        if(isReadSummary && (
            !summary ||
            !summary.name ||
            !summary.type || 
            !summary.filters
          )){
            setSummaryError(true);
            err = true;
        }

        if(!name){
          setFormNameError(true);
          err = true;
        }

        if(isFillAnswers && questionIds && questionIds.length === 0 ){
          setQuestionsError(true);
          err = true;
        }

        if(err){
          return
        }
  
        if(!form) {
          const res = await api.addForm({
            ...formDTO,
            experimentName
          }); 
          status = res.status;
        }else{
          const res = await api.updateForm({
            ...formDTO,
            experimentName
          }); 
          status = res.status;
        }
  
        if(status === ERROR_STATUS.NAME_NOT_VALID){
          setFormNameError(true);
        }
        else if(status < 0){
          //TODO add snackbar
        }
        else{
          onSave && onSave();
        }
      },[form, formDTO, experimentName, onSave]);
  
  
      const ViewSummaryComp = useMemo(() => {
        const {summary,isReadSummary}  = formDTO;
        if(!summary || !isReadSummary)
          return null;
        const {type,name,filters} = summary;
  
        return type && name && filters &&
          <Card style={{margin: "10px 0"}} >
            <QuizViewer 
              experimentName={experimentName}
              type={formDTO.summary.type}
              name={formDTO.summary.name}
              filters={formDTO.summary.filters}
            />
          </Card>
      },[formDTO, experimentName]);
      

      const filtersComp = useCallback(() => {
        const {summary} = formDTO;
        const filters = summary && summary.filters;
        const hideUnderMin = filters && filters.hideUnderMin ; 
        const minWeight = filters && filters.minWeight ; 
        const disabled = form && !form.editable;
        const FilterTag = ({children, style}) => <Paper variant="outlined" style={{
            marginBottom: '10px',
            marginRight: '10px',
            padding:'0 5px',
            display:'flex',
            height: '75px',
            alignItems: 'center',
            justifyContent: 'space-between',
            ...style
          }}> {children}
          </Paper>
        return (
          <div style={{marginTop:'30px'}}>
           <Typography variant="h6" style={{marignRight: '10px'}}>Filters:</Typography>

            <div style={{display: 'flex', alignItems:'center', flexWrap:'wrap'}}>

              <FilterTag>
                <Typography color="textSecondary" style={{marginRight:'5px'}}>Palete Size: </Typography>
                <Select
                  disabled={disabled}
                  labelId="select-color-sizes"
                  id="select-#colors"

                  value={filters.color.size}
                  onChange={(event) => {
                    const nextSize = event.target.value;
                    filters.color =  {...filters.color, size: nextSize, palete: Object.keys(COLORS[nextSize])[0]};
                    updateField('summary',{...summary, filters })
                  }}
                  input={<Input style={{display:'block', width:'100px', marginRight:'5px'}}/>}
                  renderValue={(selected) => selected}
                  MenuProps={MenuProps}
                >
                  {COLORS_SIZES.map((size) => (
                      <MenuItem key={size} value={size}>
                          <ListItemText primary={size} />
                      </MenuItem>
                  ))}
                </Select>
                <Typography color="textSecondary" style={{marginRight:'5px'}}>Palete: </Typography>
                <Select
                  disabled={disabled}
                  labelId="select-color-sizes"
                  id="select-#colors"

                  value={filters.color.palete}
                  onChange={(event) => {
                    filters.color =  {...filters.color, palete: event.target.value};
                    updateField('summary',{...summary, filters })
                  }}
                  input={<Input style={{display:'block', width:'100px'}}/>}
                  renderValue={(selected) => selected}
                  MenuProps={MenuProps}
                >
                  { Object.keys(COLORS[filters.color.size]).map((palete) => (
                      <MenuItem key={palete} value={palete}>
                          <ListItemText primary={palete} />
                          {paleteColors(COLORS[filters.color.size][palete])}
                      </MenuItem>
                  ))}
                </Select>
              </FilterTag> 

              <FilterTag>
                <FilterWeightSetter 
                  disabled={disabled}
                  weight={minWeight}
                  updateWeight={(val) => {
                    filters.minWeight = val;
                    updateField('summary',{...summary, filters })
                  }}
                />
              </FilterTag>
              
              <FilterTag style={{width:'150px'}}>
                <Typography color="textSecondary">Hide Sentences</Typography>
                <ToggleButton
                    disabled={disabled}
                    value="check"
                    selected={hideUnderMin}
                    onChange={() => {
                        filters.hideUnderMin =  !hideUnderMin;
                        updateField('summary',{...summary, filters })
                    }}
                    >
                    <CheckIcon />
                </ToggleButton> 
              </FilterTag>
            </div>
          </div>
        );
      },[formDTO, form, updateField]); 

      const SummaryComp = useCallback(() => {
        const {summary,isReadSummary}  = formDTO;
        const disabled = form && !form.editable;
        if(!summary || !isReadSummary)
          return null;

        return isReadSummary && (
          <Card variant="outlined" style={{margin:'10px 0 20px 15px', padding:'15px 20px 30px'}}>
            {summaryError && <div>ERROR</div>}
            <div style={{ display: 'flex'}}>
              <Autocomplete
                  id="edit-form-summary-type"
                  disabled={disabled}
                  style={{ width: '200px', marginRight:10 }}
                  options={['auto','eyes','merged','custom']}
                  autoHighlight
                  getOptionLabel={option => option}
                  renderInput={params => (
                <TextField
                    {...params}
                    label="Summary type"
                    // variant="outlined"
                    fullWidth
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'disabled', // disable autocomplete and autofill
                    }}
                />
                )}
                onChange={(e,Selectedtype) => {
                    setFormDTO({...formDTO, summary:{...summary, type: Selectedtype , name: '' }});
                }}
                onInputChange={(e, value) => {
                    e && setSummaryNameText('');
                    e && setSummaryTypeText(value);
                }}
                inputValue={summaryTypeText || ''}
              />
              { summary.type && 
                <Autocomplete
                    id="edit-form-choose-summary"
                    disabled={disabled}
                    style={{ width: '200px', marginRight:10 }}
                    options={summaries[summary.type].filter(sum => !sum.disabled)}
                    autoHighlight
                    getOptionLabel={option => option.data.name}
                    renderInput={params => (
                  <TextField  
                    {...params}
                    label="Choose a summary"
                    // variant="outlined"
                    fullWidth
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'disabled', // disable autocomplete and autofill
                    }}
                />
                )}
                onChange={(e,selectedSummary) => {
                    setFormDTO({...formDTO, summary:{...summary, name: selectedSummary && selectedSummary.data.name} })
                }}
                onInputChange={(e, value) => 
                    e && setSummaryNameText(value)
                }
                inputValue={summaryNameText || ''}
                />
              }
            </div>
            { summary.name && summary.type && filtersComp()}
         </Card>
      )},[form, formDTO, summaryTypeText, summaryNameText, summaryError, filtersComp, summaries]);
  
      const QuestionSectionComp = useMemo(() => {
        const disabled = form && !form.editable;
        return formDTO.isFillAnswers && 
          <div style={{marginBottom:'20px', marginLeft:'15px'}}>
            {questionsError && <Typography>ERROR</Typography>}
            <Select
              labelId="select-questions"
              id="edit-form-select-questions"
              multiple
              value={formDTO.questionIds}
              onChange={(event) => {
                console.log(event.target.value)
                if(event.target.value[0] === 'empty'){
                  !disabled && setAddQuestion(true)
                } else if(!form || form.editable){
                  setQuestionsError(false);
                  setFormDTO({...formDTO, questionIds:event.target.value });
                }
              }}
              input={<Input style={{display:'block'}}/>}
              renderValue={(selected) => {
                return questions
                .filter(q => selected.indexOf(q.id) > -1)
                .map( q =>q.data.question)
                .join(', ')
              }}
              MenuProps={MenuProps}
            >
            {questions.length === 0 ? 
              <MenuItem key={'empty'} value={'empty'} style={disabled || questions.length === 0 ? {cursor:'auto'}: {}} >
                <ListItemText primaryTypographyProps={{noWrap:true}} primary={disabled ?'You Have No Questions' : "No Questions, You May Add New, on click!!"} />
              </MenuItem> :
             questions.map((question) => (
              <MenuItem key={question.id} value={question.id} style={disabled ? {cursor:'auto'}: {}} >
                <Checkbox
                  disabled={disabled}
                  checked={formDTO.questionIds.indexOf(question.id) > -1} />
                <ListItemText primaryTypographyProps={{noWrap:true}} primary={question.data.question} />
                <Button onClick={(e) => {
                    e.stopPropagation();
                    setQuestion(question.data);
                  }} >
                  Show
                  </Button>
              </MenuItem>
            ))}
          </Select>
          {
            !addQuestion &&
              <Button 
                disabled={disabled}
                style={{display: 'block'}}
                color="primary"
                id="edit-form-add-question-button"
                onClick={() => {
                  setAddQuestion(true)
                }}
                >
                    Add Question
            </Button>
          }
  
          { addQuestion && 
                <AddQuestion 
                  onClose={() => setAddQuestion(false)}
                  onAdd={async (id) => {
                    const questions = await fetchQuestions();

                    setQuestion(questions.filter(q => q.id === id )[0].data)
                    const questionIds = [...formDTO.questionIds, id];
                    setFormDTO({...formDTO, questionIds});
                    setAddQuestion(false);
                }} />
          }
        </div>
      },[form, formDTO, addQuestion, questionsError, questions, fetchQuestions]);
  
      const renderSwitch = useCallback(({
        title,
        field,
        withFooter = false,
        onChange,
        id
      }) => {
        const disabled = form && !form.editable;
        return (
        <div>
          <div>
            <Typography variant="h6" style={{display: 'inline-block'}}>
              {title}
            </Typography>
            <Switch
              disabled={disabled}
              style={{display:'block'}}
              checked={formDTO[field]}
              onChange={() => { 
                setFormDTO({...formDTO, [field]: !formDTO[field]});
                onChange && onChange();
              }}
              inputProps={{ 'aria-label': 'secondary checkbox', id}}
            />
          </div>
          {withFooter && formDTO[field] && <Divider style={{width: '350px'}}/>}
        </div>
        )},
        [formDTO, form]
      );
      const {isReadSummary, isFillAnswers, isRankSentences, withFixations} = formDTO;
      return (isFetchingData ? <div>loading</div> : 
        <Grid container spacing={3} style={{width:"100%"}}>
          <Grid item xs={12} sm={6}>
            <Card style={{marginTop: '10px', padding: '20px'}}>
              <div style={{display:'flex', justifyContent: 'space-between', alignItems:'flex-end'}}>
                <Typography variant="h5">
                  {form? `Edit Form${disabled? ' (not editable)' : ''}` : 'Create Form'}
                </Typography>
                {onClose && (
                  <IconButton aria-label="close" onClick={onClose}>
                    <CloseIcon />
                  </IconButton>
                  )
                }
              </div>
              <Divider/>
  
              <TextField 
                disabled={form}
                error={formNameExists}
                helperText={formNameExists && "Name empty, or already exsits" }
                value={formDTO.name}
                style={{width: '200px',marginTop:'10px', marginBottom: '20px'}}
                onChange={(e) => {
                  setFormNameError(false);
                  setFormDTO({...formDTO, name: e.target.value});
                }}
                id="form-name"
                label="Form Name"/>
  
              <div id="questions-section">
                {renderSwitch({
                  title: 'Questions',
                  field: 'isFillAnswers',
                  withFooter: true,
                  onChange: () => setAddQuestion(false),
                  id:'questions-switch'
                })}
                {QuestionSectionComp}
              </div>
  
              <div id="summary-section">
                {renderSwitch({
                  title: 'Read Summary',
                  field: 'isReadSummary',
                  withFooter: true,
                  onChange: () => setAddQuestion(false),
                  id:'read-summary-switch'
                })}
                {SummaryComp()}
              </div>
              
              {renderSwitch({
                  title: 'Upload Fixations',
                  field: 'withFixations',
                  id:'upload-fixations-switch',
              })}
              {renderSwitch({
                title: 'Rank Sentences',
                field: 'isRankSentences',
                id:'rank-sentences-switch',
              })}
              
              <Button
                id='create-form-submit-btn'
                disabled={disabled || (!isRankSentences && !withFixations && !isReadSummary && !isFillAnswers)}
                style={{display: 'block' ,marginTop: '10px', float:'right'}}
                variant="contained"
                onClick={onClickSave}>
                {form? 'Save' : 'Create'}
              </Button>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            { question && 
              <div style={{margin:'10px 0'}}>
                <Question question={question} />
              </div>
            }
            {ViewSummaryComp}
          </Grid>
        </Grid> 
    )
  };

  const FilterWeightSetter = ({weight, updateWeight, disabled }) => {

    const [val,setVal] = useState(weight);
    const [lastVal,setLastVal] = useState(null);

    useEffect(() => {setVal(weight)},[weight]);

    return <div style={{display:'flex', alignItems:'center'}}>
      <TextField 
        disabled={disabled}
        style={{width:'180px', marginBottom:'15px'}}
        inputProps={{min:0,max:1, step:0.1}}
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
        disabled={disabled || (!val && val !==0) || lastVal === val}
        onClick={()=>{
          setLastVal(val)
          updateWeight(val)
        }}>
          Set
      </Button>
    </div>
  }