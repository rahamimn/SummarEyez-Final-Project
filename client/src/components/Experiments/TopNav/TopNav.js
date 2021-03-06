import React, {useState} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import WelcomeDialog from '../../WelcomeDialog/WelcomeDialog';
import {
  useHistory,
} from "react-router-dom";

const drawerWidth = 270;
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
}) => {
    const history = useHistory();
    const classes = useStyle();
    const [showModeSelection, setShowModeSelection] = useState(false);

    return <div>
      <AppBar position="fixed" className={classes.appBarWithDrawer}>
      <Toolbar>
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
        <div style={{display:"flex"}}>
          <Typography variant="h6" noWrap style={{marginRight: '10px'}}>
            SummarEyez
          </Typography> 

          {experimentName && <Typography 
            style={{color:'#dddddd'}}
            variant="h6"
            noWrap>
            {experimentName}
          </Typography>}
        </div>
        <div>
          <Button 
            style={{marginRight: '8px'}} 
            endIcon={<LibraryAddIcon/>} 
            color="inherit" 
            onClick={() => history.push(
              experimentName ? 
                `/experiments/${experimentName}/new` :
                '/experiments-new/new'
            )}>New Experiment
          </Button>
          <Button id="top-nav-mode" endIcon={<OpenInBrowserIcon/>} color="inherit" onClick={() => setShowModeSelection(true)}>Mode</Button>
        </div>
        </div>
      </Toolbar>
      
    </AppBar>
    {showModeSelection && <WelcomeDialog 
        onClose={() => setShowModeSelection(false)}/>
        }
  </div>
  
}

export default TopNav;     