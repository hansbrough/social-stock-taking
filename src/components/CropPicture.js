import React, {useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Container } from 'reactstrap';
//= ==== Components ===== //
import ImageCropper from './imageCropper';
//= ==== Store ===== //
import { selectOriginalImages } from '../features/images/originalImagesSlice';
//= ==== Style ===== //
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import '../styles/Selfie.css';

const CropPicture = () => {
  const originalImages  = useSelector(selectOriginalImages);
  const [saveClicked, setSaveClicked] = useState();
  const canvasElem      = useRef(null);

  const handleSaveClick = evt => {
    setSaveClicked(true);
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
      <p>Do your best to crop just the label.</p>
      <div className="original-picture">
        <canvas ref={canvasElem} style={{display: 'none'}}></canvas>
        <div className="preview">
          {!!originalImages.length
            && (
              <ImageCropper src={originalImages[0].imageDataURL} save={saveClicked} eventConnector={handleCropperEvents} />
          )}
          <canvas id="filteredImage" className="d-none"></canvas>
        </div>
      </div>
      <Button color="primary" onClick={handleSaveClick} className="w-100 mt-2">
        Cropped Image Lookin' Good!  <FontAwesomeIcon icon={faThumbsUp} />
      </Button>

      <ButtonGroup className="my-3 w-100">
        <Button>
          <Link className="back-navigation" to={{pathname: '/takePicture', state: { prevPath: window.location.pathname }}}>
            <FontAwesomeIcon icon={faAngleLeft} /> Back
          </Link>
        </Button>
        <Button color="primary" disabled={!saveClicked}>
          <Link className="back-navigation" to={{pathname: '/getPictureText', state: { prevPath: window.location.pathname }}}>
            Get Picture Text <FontAwesomeIcon icon={faAngleRight} />
          </Link>
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default CropPicture;
