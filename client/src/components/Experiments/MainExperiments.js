import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import DashboardIcon from '@material-ui/icons/Dashboard';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import AssessmentIcon from '@material-ui/icons/Assessment';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import AddToQueueIcon from '@material-ui/icons/AddToQueue';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { makeStyles } from '@material-ui/core/styles';
import {
  Switch,
  Route,
  useHistory,
  useParams,
  Redirect
} from "react-router-dom";
import { NewExperiment } from './NewExperiment/NewExperiment';
import TopNav from './TopNav/TopNav';
import {Summaries} from './Summaries/Summaries';
import {UploadAlgorithm} from './UploadAutomaticAlg/UploadAutomaticAlg';
import {UploadFixations} from './UploadFixations/UploadFixations';
import { FormsManager } from './FormsManager/FormsManager';
import { TestPlanManager } from './TestPlansManager/TestPlanManager';
import { Typography } from '@material-ui/core';
import { TestsPoolMain } from './TestPool/TestPoolMain';
import {ExperimentInfo} from './ExperimentInfo/ExperimentInfo';
import { AddCustomSummary } from './AddCustomSummary/AddCustomSummary';


const drawerWidth = 270;

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

function MainExperiments({permit}) {
  const { experimentName } = useParams();

  const classes = useStyles();
  const history = useHistory();
  const experimetPage = (page) => experimentName ? `/experiments/${experimentName}/${page}` : `/experiments-new/${page}`;
  const experimetRoutePage = (page, withoutExperiment = false) => !experimentName && withoutExperiment ? `/experiments-new/${page}` : `/experiments/:experimentName/${page}`;

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <ListItem id='upload-algorithm-side-button' button key={'Upload Algorithm'} onClick={e => history.push(experimetPage('algorithm'))}>
          <ListItemIcon>
            <CloudUploadIcon />
          </ListItemIcon>
          <ListItemText primary={'Upload Algorithm'} />
        </ListItem>
        <ListItem id="main-experiments-test-plans" button key={'TestPlans'} onClick={e => history.push(experimetPage('testPlans'))}>
          <ListItemIcon>
              <AllInboxIcon />
          </ListItemIcon>
          <ListItemText primary="Create New Test" secondary=" • And manage them" />
        </ListItem>
        <ListItem id='main-experiments-test-pool' button onClick={e => history.push(experimetPage('testPool'))}>
          <ListItemIcon>
            <AssessmentIcon />
          </ListItemIcon>   
          <ListItemText primary='Test Results' secondary=" • By Forms or Tests" />
        </ListItem>
      </List>
      
        {experimentName &&
          <List component="div" disablePadding>
            <Typography style={{backgroundColor:'#eeeeee',display:'flex', justifyContent:'center',height:'50px',alignItems:'center'}} variant="h5" >{experimentName}</Typography>

            <ListItem id='main-experiments-info' button onClick={e => history.push(experimetPage('info'))}>
              <ListItemIcon>
                <MenuBookIcon />
              </ListItemIcon>
              <ListItemText primary={'Info'} />
            </ListItem>

            <ListItem id='main-experiments-summaries' button onClick={e => history.push(experimetPage('summaries'))}>
              <ListItemIcon>
                <LibraryBooksIcon />
              </ListItemIcon>
              <ListItemText primary="All Summaries" secondary=" • Merge, Export, View" />
            </ListItem>

            <ListItem button  id='test-form-manager-side-button' onClick={e => history.push(experimetPage('forms'))}>
            <ListItemIcon>
              <DeveloperBoardIcon />
            </ListItemIcon>
            <ListItemText primary="Create New Form" secondary=" • Edit and more" />
            </ListItem>

            <ListItem button id='upload-fixations-side-button' onClick={e => history.push(experimetPage('uploadFixations'))}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary={'Upload Fixations'} />
            </ListItem>

            <ListItem button id='add-custom-summary-side-button' onClick={e => history.push(experimetPage('addCustomSummary'))}>
              <ListItemIcon>
                <AddToQueueIcon />
              </ListItemIcon>
              <ListItemText primary={'Add Custom Summary'}/>
            </ListItem>
          </List>
        }
    </div>
  );
  return (
    <div className={classes.root}>
      <CssBaseline />
      <TopNav experimentName={experimentName}/>
      <nav className={classes.drawer} aria-label="mailbox folders">
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
            <Route path={experimetRoutePage('algorithm',true)}>
              <UploadAlgorithm/>
            </Route>

            <Route path={experimetRoutePage('testPlans',true)}>
              <TestPlanManager/>
            </Route>
            <Route path={experimetRoutePage('testPool',true)}>
              <TestsPoolMain/>
            </Route>
            
            <Route path={'/experiments-new/new'}>
              <NewExperiment/>
            </Route>
            <Route path={experimetRoutePage('new')}>
              <NewExperiment/>
            </Route>
            <Route path={experimetRoutePage('summaries')}>
              <Summaries/>
            </Route>

            <Route path={experimetRoutePage('info')}>
              <ExperimentInfo/>
            </Route>
 
            <Route path={experimetRoutePage('forms')}>
              <FormsManager/>
            </Route>

            <Route path={experimetRoutePage('addCustomSummary')}>
              <AddCustomSummary/>
            </Route>

            <Route path={experimetRoutePage('uploadFixations')}>
              <UploadFixations
                onSuccess={() => history.push(`/experiments/${experimentName}/summaries`)}
                experimentName={experimentName}/>
            </Route>
            <Route path={experimetRoutePage('')}>
              <Redirect to={experimetPage('info')}/>
            </Route>
            {/* here we add all sub pages : (may be inners goes in sub component)
              *   forms:
              *     all forms ()
              *     edit form
              *     new form
              *     questions
              *     tests:
              *       see test results 
              *   upload algorithms
              *   summries:
              *     show summary
              *     merge summary
              *     show multiple
              *   upload manuualy - eyes(dev)
            */}
        </Switch>  
      </main>
    </div>
  );
}

export default MainExperiments;