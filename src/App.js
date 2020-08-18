import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import { TransitionGroup, CSSTransition} from 'react-transition-group';

import Home from './components/Home';
import UploadFileForm from './components/UploadFileForm';
import TakePicAndUpload from './components/TakePicAndUpload';

import { getNavigationDirection } from './utils/NavigationUtil';
import './styles/transitions.css';

function App() {

  return (
    <Router>
      <Container className="App">
      <Route render={(props) => {
        const { location } = props;
        const { key } = location;
        const direction = getNavigationDirection(location);
        console.log("direction:",direction);
        return (
          <TransitionGroup>
            <CSSTransition
              key={key}
              classNames={direction}
              timeout={500}
            >
              <div className="swipe-container">
                <Switch location={location}>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/uploadFile" component={UploadFileForm} />
                  <Route exact path="/takePicture" component={TakePicAndUpload} />
                </Switch>
              </div>
            </CSSTransition>
          </TransitionGroup>
        )}
      }
      />
      </Container>
    </Router>
  );
}

export default App;
