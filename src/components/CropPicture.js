import React, {useRef, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Button, ButtonGroup, Container } from 'reactstrap';
//= ==== Components ===== //
import ImageCropper from './imageCropper';
//= ==== Store ===== //
import { selectCurrentWorkflow, saveCurrentWorkflow } from '../features/currentWorkflowSlice';
import { selectOriginalImageById } from '../features/images/originalImagesSlice';
//= ==== Style ===== //
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import '../styles/Selfie.css';

const CropPicture = () => {
  const dispatch        = useDispatch();
  const history         = useHistory();
  const currentWorkflow = useSelector(selectCurrentWorkflow);
  const originalImage   = useSelector((state) => selectOriginalImageById(state, currentWorkflow.wid));

  const [saveClicked, setSaveClicked] = useState();
  const canvasElem      = useRef(null);

  const handleSaveClick = evt => {
    setSaveClicked(true);
    dispatch(saveCurrentWorkflow({ completed: { cropPicture: true }}));
    history.push({pathname: '/getPictureText', state: { prevPath: window.location.pathname }});
  };

  // provided to the cropper component which hands back a reference to it's imageElem.
  // Listen for cropper events as needed.
  const handleCropperEvents = (imageElementRef) => {
    // when user is using the cropping tool (e.g. dragging, expanding)
    imageElementRef.addEventListener('crop', () => setSaveClicked(false));
  }

  return (
    <Container className="crop-picture-screen">
      <h1>Crop Picture</h1>
      <p>Do your best to crop just the important part of the label.</p>
      <div className="original-picture">
        <canvas ref={canvasElem} style={{display: 'none'}}></canvas>
        <div className="preview">
          {!!originalImage
            && (
              <ImageCropper src={originalImage.imageDataURL} save={saveClicked} eventConnector={handleCropperEvents} />
          )}
          <canvas id="filteredImage" className="d-none"></canvas>
        </div>
      </div>

      <ButtonGroup className="my-3 w-100">
        <Button onClick={() => history.push({
            pathname: '/takePicture',
            state: { prevPath: window.location.pathname }
          })}
        >
          <FontAwesomeIcon icon={faAngleLeft} /> Back
        </Button>
        <Button color="primary" onClick={handleSaveClick}>
          Done Cropping! Next <FontAwesomeIcon icon={faAngleRight} />
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default CropPicture;
