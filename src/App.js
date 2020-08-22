import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import { TransitionGroup, CSSTransition} from 'react-transition-group';

//= ==== Components ===== //
import Home from './components/Home';
import UploadFileForm from './components/UploadFileForm';
import TakePicture from './components/TakePicture';
import CropPicture from './components/CropPicture';
import OCRPicture from './components/OCRPicture';
import SetPlace from './components/SetPlace';
import Finish from './components/Finish';
//= ==== Utils ===== //
import { getNavigationDirection } from './utils/NavigationUtil';
import { writePlacesApi } from './utils/KeysUtil';
//= ==== Style ===== //
import './styles/transitions.css';

function App() {
  writePlacesApi();
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
                  <Route exact path="/takePicture" component={TakePicture} />
                  <Route exact path="/cropPicture" component={CropPicture} />
                  <Route exact path="/getPictureText" component={OCRPicture} />
                  <Route exact path="/setPlace" component={SetPlace} />
                  <Route exact path="/finish" component={Finish} />
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
