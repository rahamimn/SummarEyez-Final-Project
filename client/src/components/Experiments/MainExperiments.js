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
import { makeStyles } from '@material-ui/core/styles';
import {
  Switch,
  Route,
  useHistory,
  useParams,
  Redirect
} from "react-router-dom";
import { NewExperiment } from './NewExperiment/NewExperiment';
import TopNav from '../TopNav/TopNav';
import {Summaries} from './Summaries/Summaries';
import {UploadAlgorithm} from './UploadAutomaticAlg/UploadAutomaticAlg';
import {UploadFixations} from './UploadFixations/UploadFixations';
import { FormsManager } from './FormsManager/FormsManager';
import { TestPlanManager } from './TestPlansManager/TestPlanManager';


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
  const experimetRoutePage = (page) => `/experiments/:experimentName/${page}`;

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>

        <ListItem button key={'Upload Algorithm'} onClick={e => history.push(experimetPage('algorithm'))}>
          <ListItemIcon>
            <CloudUploadIcon />
          </ListItemIcon>
          <ListItemText primary={'Upload Algorithm'} />
        </ListItem>
        {experimentName &&
          [<ListItem button key={'Summaries'} onClick={e => history.push(experimetPage('summaries'))}>
          <ListItemIcon>
            <LibraryBooksIcon />
          </ListItemIcon>
            <ListItemText primary={'Summaries'} />
          </ListItem>,

          <ListItem button key={'Forms'} onClick={e => history.push(experimetPage('forms'))}>
          <ListItemIcon>
            <DeveloperBoardIcon />
          </ListItemIcon>
            <ListItemText primary={'Test Forms Manager'} />
          </ListItem>,

          <ListItem button key={'TestPlans'} onClick={e => history.push(experimetPage('testPlans'))}>
          <ListItemIcon>
            <AllInboxIcon />
          </ListItemIcon>
            <ListItemText primary={'Test Plans Manager'} />
          </ListItem>,

          <ListItem button key={'Tests'} onClick={e => history.push(experimetPage('tests'))}>
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>   
            <ListItemText primary={'Test pool'} />
          </ListItem>,

          <ListItem button key={'Upload Fixations'} onClick={e => history.push(experimetPage('uploadFixations'))}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary={'Upload Fixations'} />
          </ListItem>]
        }


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
      <TopNav isExperimentMode experimentName={experimentName} permit={permit}/>
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
            <Route path={'/experiments-new'}>
              <NewExperiment/>
            </Route>
            <Route path={experimetRoutePage('new')}>
              <NewExperiment/>
            </Route>
            <Route path={experimetRoutePage('summaries')}>
              <Summaries/>
            </Route>
            <Route path={experimetRoutePage('algorithm')}>
              <UploadAlgorithm/>
            </Route>
            <Route path={experimetRoutePage('forms')}>
              <FormsManager/>
            </Route>
            <Route path={experimetRoutePage('testPlans')}>
              <TestPlanManager/>
            </Route>
            <Route path={experimetRoutePage('uploadFixations')}>
              <UploadFixations
                onSuccess={() => history.push(`/experiments/${experimentName}/summaries`)}
                experimentName={experimentName}/>
            </Route>
            <Route path={experimetRoutePage('')}>
              <Redirect to={experimetPage('summaries')}/>
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