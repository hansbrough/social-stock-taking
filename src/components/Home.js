import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button
} from 'reactstrap';
//= ==== Style ===== //
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCameraRetro, faFileImage } from '@fortawesome/free-solid-svg-icons';
import '../styles/main.css';

const Home = () => {
  const history = useHistory();
  return (
    <main className="home-screen">
      <h1 className="display-3">Plant Hunter</h1>
      <h2>Locate, Document, Share</h2>

      <section className="mt-5">
        <Button className="mb-4 large-circle-btn" onClick={() => history.push({
            pathname: '/takePicture',
            state: { prevPath: window.location.pathname }
          })}
        >
          <FontAwesomeIcon icon={faCameraRetro} /> Photo
        </Button>

        <Button className="large-circle-btn" onClick={() => history.push({
            pathname: '/uploadFile',
            state: { prevPath: window.location.pathname }
          })}
        >
          <FontAwesomeIcon icon={faFileImage} /> Upload
        </Button>
      </section>

    </main>
  );
};

export default Home;
