import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import {useDispatch} from 'react-redux';
import { Container, Button, ButtonGroup } from 'reactstrap';
//= ==== Store ===== //
import { resetCurrentWorkflow } from '../features/currentWorkflowSlice';
//= ==== Style ===== //
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCamera } from '@fortawesome/free-solid-svg-icons';
import '../styles/Selfie.css';

const Success = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetCurrentWorkflow())
  },[dispatch]);

  return (
    <Container className="ocr-picture-screen">
      <h1 className="text-success">Success!</h1>
      <p>Your plant and it's details have been saved.</p>
      <div className="d-flex justify-content-center mb-3">
        <h2 className="display-1 text-success"><FontAwesomeIcon icon={faCheckCircle} /></h2>
      </div>

      <ButtonGroup className="my-3 w-100">
        <Button color="primary">
          <Link className="back-navigation" to={{pathname: '/takePicture', state: { prevPath: window.location.pathname }}}>
            Take another picture <FontAwesomeIcon icon={faCamera} />
          </Link>
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default Success;
