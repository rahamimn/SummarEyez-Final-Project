import React, {useState} from 'react';
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import WelcomeDialog from './WelcomeDialog/WelcomeDialog';
import MainExperiments from './Experiments/MainExperiments';
import MainTests from './Tests/MainTests';
import {ArticleMain} from './Viewers/ArticleViewer/ArticleMain';
import {LayersMain} from './Viewers/LayersViewer/LayersMain';


function Main() {
  const [experimentsPermission, setPermission] = useState(null);
  const permit = (permission = true) => setPermission(permission);
  
  return (
    <div>
      <Switch>
        <Route path="/article/:experimentName/:type/:name">
          <ArticleMain/>
        </Route>
        <Route path="/article-layers/:experimentName">
          <LayersMain/>
        </Route>
        <Route path="/experiments-new" render={ () => {
          if(experimentsPermission || true) {
            return <MainExperiments permit={permit} />
          }
          return <Redirect to={{pathname: "/"}}/>
        }}/>
        <Route path="/experiments/:experimentName" render={ () => {
          if(experimentsPermission || true) {
            return <MainExperiments permit={permit} />
          }
          return <Redirect to={{pathname: "/"}}/>
        }}/>
        <Route path="/tests">
          <MainTests permit={permit}/>
        </Route>
        <Route path="/">
          <div style={{
            width: '100%',
            height: '100vh',
            backgroundImage:"url(/background.jpg)"
            }}>
              <WelcomeDialog permit={permit}/>
            </div>
        </Route>
      </Switch>   
    </div>
  );
}

export default Main;
