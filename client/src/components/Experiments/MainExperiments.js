import React, {useState} from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import Collapse from '@material-ui/core/Collapse';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {
  Switch,
  Route,
  useHistory,
  Redirect,
} from "react-router-dom";
import { NewExperiment } from './NewExperiment/NewExperiment';
import { ArticleViewer } from '../ArticleViewer/ArticleViewer';
import { Button } from '@material-ui/core';
import WelcomeDialog from '../WelcomeDialog/WelcomeDialog';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  nested:{
    paddingLeft: theme.spacing(4),
  },
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function MainExperiments(props) {
  const classes = useStyles();
  const history = useHistory();
  const [showModeSelection, setShowModeSelection] = useState(false);
  
  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>

        <ListItem button key={'Upload Algorithm'} onClick={e => history.push('/algorithm')}>
          <ListItemText primary={'Upload Algorithm'} />
        </ListItem>


        <ListItem button key={'Tests'} onClick={e => history.push('/tests')}>
          <ListItemText primary={'Conduct Test'} />
        </ListItem>

        <ListItem button key={'Edit Test'} onClick={e => history.push('/tests')}>
          <ListItemText primary={'Conduct Test'} />
        </ListItem>


        {/* <ListItem button key={'Conduct Test'} onClick={e => setOpenH2H(!openH2H)}>
          <ListItemText primary={'Conduct Test'} />
          {openH2H ? <ExpandLess /> : <ExpandMore />}
        </ListItem> */}

        {/* <Collapse in={openH2H} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {[{ text: 'Predictions', link:'/h2h'}, { text: 'Last Games', link:'/h2h-stats'} ].map((navItem) => (
              <ListItem button key={navItem.text} onClick={e => history.push(navItem.link)} className={classes.nested}>
                <ListItemText primary={navItem.text} />
              </ListItem>
            ))}
          </List>
        </Collapse> */}
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
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
            <Button color="inherit" onClick={() => setShowModeSelection(true)}>Mode</Button>
            <Button color="inherit" onClick={() => history.push('/experiments/new')}>New Experiment</Button>
          </div>
          </div>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Switch>
          <Route path="/experiments/new">
            <NewExperiment/>
          </Route>
      </Switch>  
    </main>
    {showModeSelection && <WelcomeDialog 
      onClose={() => setShowModeSelection(false)}/>
      }
    </div>
  );
}

export default MainExperiments;

