import React from 'react';

import TabPanel from './TabPanel';
import { Tabs, Tab, Dialog, AppBar } from '@material-ui/core';

import ChooseFromExistingTabPanel from './ChooseFromExisting_TabPanel';
import CreateNewExpTabPanel from './CreateNewExp_TabPanel copy';
import TestsTabPanel from './Tests_TabPanel';



export default function WelcomeDialog({
  onClose,
  permit,
}) {
  const [value, setValue] = React.useState(0);

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
            <Tab label="Create New" {...a11yProps(0)} />
            <Tab id="welcome dialog-choose" label="Choose Existing" {...a11yProps(1)} />
            <Tab label="Tests" {...a11yProps(2)} />
          </Tabs>
        </AppBar>

        <div style={{minHeight:'250px', maxWidth:'470px'}}>
          <TabPanel  value={value} index={0}>
            <CreateNewExpTabPanel permit={permit} onClose={onClose}/>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <ChooseFromExistingTabPanel permit={permit} onClose={onClose}/>
          </TabPanel>

          <TabPanel  value={value} index={2}>
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
