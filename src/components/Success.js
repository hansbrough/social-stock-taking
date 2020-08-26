import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Button, ButtonGroup } from 'reactstrap';
//= ==== Store ===== //
import { selectCurrentWorkflow, resetCurrentWorkflow } from '../features/currentWorkflowSlice';
import { saveWorkflows } from '../features/workflowsSlice';
//= ==== Style ===== //
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCamera } from '@fortawesome/free-solid-svg-icons';
import '../styles/main.css';

const Success = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const currentWorkflow = useSelector(selectCurrentWorkflow);
  const [flag, setFlag] = useState();

  useEffect(() => {
    if(!flag && currentWorkflow) {
      setFlag(true);
      dispatch(saveWorkflows({...currentWorkflow}))
      dispatch(resetCurrentWorkflow())
    }

  },[dispatch, currentWorkflow, flag]);

  return (
    <Container className="ocr-picture-screen">
      <h1 className="text-success">Success!</h1>
      <p>Your plant and it's details have been saved.</p>
      <div className="d-flex justify-content-center mb-3">
        <h2 className="display-1 text-success"><FontAwesomeIcon icon={faCheckCircle} /></h2>
      </div>

      <ButtonGroup className="my-3 w-100">
        <Button color="primary" onClick={() => history.push({
            pathname: '/takePicture',
            state: { prevPath: window.location.pathname }
          })}
        >
          Take another picture <FontAwesomeIcon icon={faCamera} />
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default Success;
