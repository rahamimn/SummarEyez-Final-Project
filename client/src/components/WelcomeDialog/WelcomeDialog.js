import React from 'react';

import TabPanel from './TabPanel';
import { Tabs, Tab, Dialog, AppBar } from '@material-ui/core';

import ChooseFromExistingTabPanel from './ChooseFromExisting_TabPanel';
import CreateNewExpTabPanel from './CreateNewExp_TabPanel';
import TestsTabPanel from './Tests_TabPanel';

import AddIcon from '@material-ui/icons/Add';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import DvrIcon from '@material-ui/icons/Dvr';

export default function WelcomeDialog({
  onClose,
  permit,
  withNewTab
}) {
  const [value, setValue] = React.useState(0);
  const indexTab = (index) =>  withNewTab ? index : index - 1; 
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Dialog 
        open={true} 
        onClose={onClose}
        aria-labelledby="form-dialog-title"
        disableBackdropClick = {!!!onClose}
        disableEscapeKeyDown = {!!!onClose}
        >
        <AppBar position="static" color="default" style={{padding: '0 3px'}}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            indicatorColor="primary"
            textColor="primary"
            aria-label="scrollable force tabs example"
          >
            <Tab id="welcome dialog-choose" label={<span style={{display:'flex', alignItems:'flex-end'}}><DvrIcon style={{marginRight:'5px'}}/> Choose Existing </span>} {...a11yProps(0)} />
            {withNewTab && <Tab label={<span style={{display:'flex', alignItems:'flex-end'}}><AddIcon style={{marginRight:'5px'}}/> Create New </span>} {...a11yProps(indexTab(1))}/>}
            <Tab label={<span style={{display:'flex', alignItems:'flex-end'}}><FilterNoneIcon style={{marginRight:'5px'}}/> Tests </span>} {...a11yProps(indexTab(2))}/>
          </Tabs>
        </AppBar>

        <div style={{minHeight:'250px',width:'470px'}}>
          <TabPanel value={value} index={0}>
            <ChooseFromExistingTabPanel permit={permit} onClose={onClose}/>
          </TabPanel>

          {withNewTab && <TabPanel value={value} index={indexTab(1)}>
            <CreateNewExpTabPanel permit={permit} onClose={onClose}/>
          </TabPanel>}

          <TabPanel value={value} index={indexTab(2)}>
            <TestsTabPanel/>
          </TabPanel>
        </div>
      </Dialog>
      
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `tabPanel-${index}`,
    'aria-controls': `tabpanel-control-${index}`,
  };
}
