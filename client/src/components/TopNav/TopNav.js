import React, {useState} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import WelcomeDialog from '../WelcomeDialog/WelcomeDialog';
import {
  useHistory,
} from "react-router-dom";

const drawerWidth = 240;
const useStyle = makeStyles(theme => ({
  appBarWithDrawer: {
      [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      },
  },
}));

export const TopNav = ({
    experimentName,
    isExperimentMode,
    permit
}) => {
    const history = useHistory();
    const classes = useStyle();
    const [showModeSelection, setShowModeSelection] = useState(false);

    return <div>
      <AppBar position="fixed" className={isExperimentMode ? classes.appBarWithDrawer: 'ffff'}>
      <Toolbar>
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between'
        }}>

        <Typography variant="h6" noWrap>
          Summareyez
        </Typography>
        <div>
          {isExperimentMode && <Button color="inherit" onClick={() => history.push(
            experimentName ? `/experiments/${experimentName}/new` : '/experiments-new'
            )}>New Experiment</Button>}
          <Button color="inherit" onClick={() => setShowModeSelection(true)}>Mode</Button>
        </div>
        </div>
      </Toolbar>
      
    </AppBar>
    {showModeSelection && <WelcomeDialog 
        experimentName={experimentName}
        onClose={() => setShowModeSelection(false)}
        permit={permit}/>
        }
  </div>
  
}

export default TopNav;