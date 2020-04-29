import React,{useState,useEffect, useCallback, useMemo} from 'react';
import { Typography, Grid, Card, TextField, Button, Divider, Select, MenuItem, Checkbox, ListItemText, Input, Switch, Paper } from '@material-ui/core';
import { QuizViewer } from '../../../Viewers/quizViewer/quizViewer';
import {
  useParams,
} from "react-router-dom";
import api from '../../../../apiService';
import { Question } from '../../../Tests/form/quiz/question/question';
import { ERROR_STATUS } from '../../../ERRORS';
import { AddQuestion } from '../AddQuestion/AddQuestion';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ToggleButton from '@material-ui/lab/ToggleButton';
import CheckIcon from '@material-ui/icons/Check';
import { COLORS_SIZES, COLORS } from '../../../Viewers/colors';

const emptyForm = {
    name:'',
    questionIds:[],
    isRankSentences: false,
    isFillAnswers: false,
    isReadSummary: false,
    withFixations: false,
    summary: { filters:{ 
      isGradient: true,
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
    {colors.map(color => <div style={{height:'30px', width:'30px', backgroundColor: color}}></div>)}
</div>

export function EditForm({
    onSave,
    form,
    }){
      const {experimentName} = useParams();
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
      const [summaryNameText, setSummaryNameText] = useState('');
      const [summaryTypeText, setSummaryTypeText] = useState('');
      const [formDTO,setFormDTO] = useState(form || emptyForm);
  
      const updateField = (name, value) => setFormDTO({...formDTO,[name]: value });

      const fetchQuestions = useCallback(async() => { 
        const {data, status} = await api.getQuestions(experimentName);
        //Handle status
        setQuestions(data);
        return data;
      },[]);

      const fetchSummaries = useCallback(async() => {
        const {data, status} = await api.getSummaries(experimentName);
        //Handle status
        setSummaries(data);
        return data;
      },[]);
  
      //run once
      useEffect(() => {
        fetchQuestions();
        fetchSummaries();
      },[]);
  
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
      },[formDTO]);
  
  
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
      },[formDTO]);
      

      const filtersComp = useMemo(() => {
        const {summary} = formDTO;
        const filters = summary && summary.filters;
        const isGradient = filters && filters.isGradient ; 
        const minWeight = filters && filters.minWeight ; 

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
                  disabled={form}
                  labelId="select-color-sizes"
                  id="select-#colors"

                  value={filters.color.size}
                  onChange={(event) => {
                    filters.color =  {...filters.color, size: event.target.value};
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
                  disabled={form}
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

              <FilterTag style={{width:'150px'}}>
                <Typography color="textSecondary">Gradient</Typography>
                <ToggleButton
                    disabled={form}
                    value="check"
                    selected={isGradient}
                    onChange={() => {
                        filters.isGradient =  !isGradient;
                        updateField('summary',{...summary, filters })
                    }}
                    >
                    <CheckIcon />
                </ToggleButton> 
              </FilterTag>

              <FilterTag >
                <TextField 
                  disabled={form}
                  style={{width:'180px', marginBottom:'15px'}}
                  inputProps={{min:0,max:1, step:0.1}}
                  type="number"
                  value={minWeight}
                  onChange={(e) => {
                    filters.minWeight =  e.target.value;
                    updateField('summary',{...summary, filters })
                  }}
                  id="minimumWeight"
                  label="minimum weight" />
              </FilterTag>
            </div>
          </div>
        );
      },[formDTO, form]); 

      const SummaryComp = useMemo(() => {
        const {summary,isReadSummary}  = formDTO;
        if(!summary || !isReadSummary)
          return null;

        return isReadSummary && (
          <Card variant="outlined" style={{margin:'10px 0 20px 15px', padding:'15px 30px 30px'}}>
            {summaryError && <div>ERROR</div>}
            <div style={{ display: 'flex'}}>
              <Autocomplete
                  disabled={form}
                  style={{ width: '200px', marginRight:10 }}
                  options={['auto','eyes','merged']}
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
                    disabled={form}
                    style={{ width: '200px', marginRight:10 }}
                    options={summaries[summary.type]}
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
            { summary.name && summary.type && filtersComp}
         </Card>
      )},[form, formDTO, summaryTypeText, summaryNameText, summaryError]);
  
      const QuestionSectionComp = useMemo(() => {
        return formDTO.isFillAnswers && 
          <div style={{marginBottom:'20px', marginLeft:'15px'}}>
            {questionsError && <Typography>ERROR</Typography>}
            <Select
              disabled={form}
              labelId="select-questions"
              id="select-questions"
              multiple
              value={formDTO.questionIds}
              onChange={(event) => {
                setQuestionsError(false);
                setFormDTO({...formDTO, questionIds:event.target.value });
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
            {questions.map((question) => (
              <MenuItem key={question.id} value={question.id}>
                <Checkbox checked={formDTO.questionIds.indexOf(question.id) > -1} />
                <ListItemText primary={question.data.question} />
                <Button onClick={(e) => {
                    e.stopPropagation();
                    setQuestion(question.data);
                  }} >
                  Show
                  </Button>
              </MenuItem>
            ))}
          </Select>
          {!addQuestion &&
            <Button 
              style={{display: 'block'}}
              color="primary"
              onClick={() => {
                setAddQuestion(true)
              }}
              >
                  Add Question
          </Button>}
  
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
      },[formDTO, addQuestion, questionsError]);
  
      const renderSwitch = useCallback((title,field,withFooter, onChange, ) => {
        return (
        <div>
          <div>
            <Typography variant="h6" style={{display: 'inline-block'}}>
              {title}
            </Typography>
            <Switch
              disabled={form}
              style={{display:'block'}}
              checked={formDTO[field]}
              onChange={() => { 
                setFormDTO({...formDTO, [field]: !formDTO[field]});
                onChange && onChange();
              }}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </div>
          {withFooter && formDTO[field] && <Divider style={{width: '350px'}}/>}
        </div>
        )},
        [formDTO, form]
      );
  
      return (
        <Grid container spacing={3} style={{width:"100%"}}>
          <Grid item xs={12} sm={6}>
            <Card style={{marginTop: '10px', padding: '20px'}}>
              <Typography variant="h5">
                {form? 'Edit Form' : 'Create Form'}
              </Typography>
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
                {renderSwitch(
                  'Questions',
                  'isFillAnswers',
                  true,
                  () => setAddQuestion(false)
                )}
                {QuestionSectionComp}
              </div>
  
              <div id="summary-section">
                {renderSwitch(
                  'Read Summary',
                  'isReadSummary',
                  true
                )}
                {SummaryComp}
              </div>
              
              {renderSwitch(
                'Upload Fixations',
                'withFixations',
                false,
              )}
              {renderSwitch(
                'Rank Sentances',
                'isRankSentences',
                false,
              )}
              
              <Button
                disabled={form}
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
  }
  