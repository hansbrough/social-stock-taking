import React, {useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Button, ButtonGroup } from 'reactstrap';
//= ==== Components ===== //

//import {storage} from '../firebase/firebase';
//= ==== Store ===== //
import { selectOriginalImages } from '../features/images/originalImagesSlice';

//= ==== Style ===== //
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import '../styles/Selfie.css';

const Finish = () => {
  const dispatch = useDispatch();
  const originalImages  = useSelector(selectOriginalImages);

  // do something once ...
  useEffect(() => {

  },[]);

  // const uploadToCloud = () => {
  //   const uploadTask = storage.ref(`/test/selfie1.png`).putString(originalImages[0].imageDataURL, 'data_url');
  //   uploadTask.on('state_changed',
  //   (snapShot) => {
  //     //takes a snap shot of the progress as it is happening
  //     console.log(snapShot)
  //   }, (err) => {
  //     //catches the errors
  //     console.log(err)
  //   })
  // }

  return (
    <Container className="ocr-picture-screen">
      <h1>Finish</h1>
      <p>Double check the details and save to the cloud.</p>
      <div className="original-picture">
        <div className="preview">
          {!!originalImages.length && <img className="preview-img" alt="" src={originalImages[0].imageDataURL} />}
        </div>
      </div>


      <ButtonGroup className="my-3 w-100">
        <Button>
          <Link className="back-navigation" to={{pathname: '/setPlace', state: { prevPath: window.location.pathname }}}>
            <FontAwesomeIcon icon={faAngleLeft} /> Back
          </Link>
        </Button>
        <Button>
          <Link className="back-navigation" to={{pathname: '/', state: { prevPath: window.location.pathname }}}>
            Home <FontAwesomeIcon icon={faAngleRight} />
          </Link>
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default Finish;
