import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Header from './components/header';
import Transcript from './components/transcripts';
import TranscriptDetails from './components/transcripts/TranscriptDetails';
import UploadVideo from './components/upload_video';
import axiosInstance from './components/axios';
import './App.css';


function App() {
  let [count, setCount] = useState(0);
  let [page, setPage] = useState(null);

  axiosInstance('/api/transcript/list')
  .then(response => {
    const data = response.data;
    setCount((data instanceof Array && data.length) || 0);
  })
  .catch(err => null);

  return (
    <Router>
      <div className="app"></div>
        <Header setPage={data => setPage(data)}>TRANSCRIPT EXTRACTOR - LIST</Header>
        <div className="container flex">
          <Switch>
            <Route path="/upload">
              <UploadVideo />
            </Route>
            <Route path="/transcripts" exact={true}>
              <Transcript />
            </Route>
            <Route path="/transcripts/:id" component={TranscriptDetails} />
          </Switch>
        </div>
    </Router>
  );
}

export default App;
