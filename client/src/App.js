import React from 'react';
import {
  BrowserRouter as Router,
} from "react-router-dom";

import './App.css';

import Main from './components/Main'
function App() {
  return (
    <div className="App" datahook="full-page">
      <Router>
        <Main/>
      </Router>
    </div>
  );
}

export default App;
