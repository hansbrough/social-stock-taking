import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from 'reactstrap';

import Home from './components/Home';
import UploadFileForm from './components/UploadFileForm';
import TakePicAndUpload from './components/TakePicAndUpload';

function App() {

  return (
    <Router>
      <Container className="App">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/uploadFile" component={UploadFileForm} />
        <Route exact path="/takePicture" component={TakePicAndUpload} />
      </Switch>
      </Container>
    </Router>
  );
}

export default App;
