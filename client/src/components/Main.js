import React, {useState} from 'react';
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import WelcomeDialog from './WelcomeDialog/WelcomeDialog';
import MainExperiments from './Experiments/MainExperiments';
import MainTests from './Tests/MainTests';


function Main() {
  const [experimentsPermission, setPermission] = useState(null);
  const permit = (permission = true) => setPermission(permission);
  
  return (
    <div>
      <Switch>
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
            backgroundColor:'#dddddd'
            }}>
              <WelcomeDialog permit={permit}/>
            </div>
        </Route>
      </Switch>   
    </div>
  );
}

export default Main;
