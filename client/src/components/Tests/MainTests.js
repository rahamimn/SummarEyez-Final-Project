import React, {useState,useEffect} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import {
  Switch,
  Route,
} from "react-router-dom";
import { TopNav } from '../TopNav/TopNav';
import { ArticleViewer } from '../ArticleViewer/ArticleViewer';
import api from '../../apiService';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function MainTests({permit}) {
  const classes = useStyles();
  const [json,setJson ] = useState(mockJson);

  useEffect(() => {
    const fetch = async () => {
      const json = await api.getSummary('1','2','3');
      setJson(json);
    }
    fetch();
  },[]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <TopNav permit={permit}/>
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <Card style={{
          width: '80%',
        }}>
          <Switch>
              <Route path="/tests">
                <ArticleViewer json={json}/>
              </Route>
          </Switch>  
        </Card>
      </div>
    </main>
    </div>
  );
}

export default MainTests;


const mockJson = [
  {
    "index": 0,
    "text": "A Teacher’s Ability to Relate Well with Students Versus Excellent Knowledge of the Subject Being Taught  According to you, which one is more important between teacher’s ability to relate well with the students and excellent knowledge of the subject being taught?",
    "par_num": 1,
    "word_count": 41,
    "char_count": 262,
    "weight": 1
  },
  {
    "index": 1,
    "text": "Having advanced knowledge about the subjects is one of the requirement to be a good teacher.",
    "par_num": 2,
    "word_count": 16,
    "char_count": 92,
    "weight": 0.02601399876883792
  },
  {
    "index": 2,
    "text": "If the teacher does not know or understand the material that he/she has to teach, then what will he/she teach to his/her students?",
    "par_num": 2,
    "word_count": 23,
    "char_count": 130,
    "weight": 0.21928364606370124
  },
  {
    "index": 3,
    "text": "The teacher can give wrong information or explanations to the students and it can ruin the children’s knowledge.",
    "par_num": 2,
    "word_count": 18,
    "char_count": 112,
    "weight": 0.2040309158477919
  },
  {
    "index": 4,
    "text": "It can lead to the poor education.",
    "par_num": 2,
    "word_count": 7,
    "char_count": 34,
    "weight": 0.04329586648731219
  },
  {
    "index": 5,
    "text": "The teacher may also unable to answer the students’ questions.",
    "par_num": 2,
    "word_count": 10,
    "char_count": 62,
    "weight": 0.03914639429105583
  },
  {
    "index": 6,
    "text": "That is why having an excellent knowledge of the material being taught is a must for a teacher.",
    "par_num": 2,
    "word_count": 18,
    "char_count": 95,
    "weight": 0.038394017464262103
  },
  {
    "index": 7,
    "text": "Teacher has to give more information to the students beside the information available in the text books.",
    "par_num": 2,
    "word_count": 17,
    "char_count": 104,
    "weight": 0.16406374683659744
  },
  {
    "index": 8,
    "text": "He/she should make or help the students to understand the lesson.",
    "par_num": 2,
    "word_count": 11,
    "char_count": 65,
    "weight": 0.06404322746859396
  },
  {
    "index": 9,
    "text": "That is his/her main responsibility.",
    "par_num": 2,
    "word_count": 5,
    "char_count": 36,
    "weight": 0.08720731401472835
  },
  {
    "index": 10,
    "text": "Although having advanced knowledge about the subjects is one of the requirement to be a good teacher, a teacher’s skill to make friend with students is more important than excellent knowledge of the subject being taught.",
    "par_num": 3,
    "word_count": 36,
    "char_count": 220,
    "weight": 0.2157953535031121
  },
  {
    "index": 11,
    "text": "A good teacher should have a great knowledge about the subjects, good attitude and personality, ability to deliver lessons well, ability relate well with student, and skill to evaluate herself or himself and her or his students.",
    "par_num": 3,
    "word_count": 37,
    "char_count": 228,
    "weight": 0.27983858097170605
  },
  {
    "index": 12,
    "text": "If a teacher has the knowledge about the subject that he or she teaches without a good relationship with the students, the lessons that she or he deliveres will not be received well by the students.",
    "par_num": 3,
    "word_count": 36,
    "char_count": 198,
    "weight": 0.23658831307995715
  },
  {
    "index": 13,
    "text": "The relationship among them is fundamental because it can affect the mood of the students to learn the subject.",
    "par_num": 3,
    "word_count": 19,
    "char_count": 111,
    "weight": 0.12842844440391235
  },
  {
    "index": 14,
    "text": "Futhermore, if the students relate well with their teacher, they will enjoy the class and the subject being taught.",
    "par_num": 3,
    "word_count": 19,
    "char_count": 115,
    "weight": 0.1940676227172203
  },
  {
    "index": 15,
    "text": "It contributes to the students’ likeness or dislikeness toward this lesson.",
    "par_num": 3,
    "word_count": 11,
    "char_count": 75,
    "weight": 0.07464490093705115
  },
  {
    "index": 16,
    "text": "This motivation will force the students to study hard and to listen to the teacher’s explanations in the class.",
    "par_num": 3,
    "word_count": 19,
    "char_count": 111,
    "weight": 0.0625384738150065
  },
  {
    "index": 17,
    "text": "By having close relationship with the students, a teacher can be the students’ friend.",
    "par_num": 4,
    "word_count": 14,
    "char_count": 86,
    "weight": 0
  },
  {
    "index": 18,
    "text": "The students can talk about anything to the teacher, including their problem in learning, hence the teacher can understand their problems and help them to solve their problems.",
    "par_num": 4,
    "word_count": 28,
    "char_count": 176,
    "weight": 0
  },
  {
    "index": 19,
    "text": "If the students do not relate well with the teacher, they will not share their problems to the teacher, so that the teacher does not know the problems that the students face and cannot help them.",
    "par_num": 4,
    "word_count": 36,
    "char_count": 195,
    "weight": 0
  },
  {
    "index": 20,
    "text": "It can decrease the performances of the students.",
    "par_num": 4,
    "word_count": 8,
    "char_count": 49,
    "weight": 0.011399648890814162
  }
]