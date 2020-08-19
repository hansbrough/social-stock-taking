import React, {useRef} from 'react';
import {useSelector} from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Container } from 'reactstrap';
//= ==== Components ===== //
import ImageCropper from './imageCropper';

import { selectOriginalImages } from '../features/images/originalImagesSlice';
//import { selectCroppedImages } from '../features/images/croppedImagesSlice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import '../styles/Selfie.css';

const CropPicture = () => {
  const originalImages  = useSelector(selectOriginalImages);
  //const croppedImages   = useSelector(selectCroppedImages);

  const canvasElem      = useRef(null);

  return (
    <Container className="crop-picture-screen">
      <h1>Crop Picture</h1>
      <div className="original-picture">
        <canvas ref={canvasElem} style={{display: 'none'}}></canvas>
        <div className="preview">
          {!!originalImages.length
            && (
              <ImageCropper src={originalImages[0].imageDataURL} />
          )}
          <canvas id="filteredImage" className="d-none"></canvas>
        </div>
      </div>

      <ButtonGroup className="my-3 w-100">
        <Button>
          <Link className="back-navigation" to={{pathname: '/takePicture', state: { prevPath: window.location.pathname }}}>
            <FontAwesomeIcon icon={faAngleLeft} /> Back
          </Link>
        </Button>

        {!!originalImages.length
          && (
          <Button className="ml-2" color="primary">
            <Link className="back-navigation" to={{pathname: '/getPictureText', state: { prevPath: window.location.pathname }}}>
              Get Picture Text <FontAwesomeIcon icon={faAngleRight} />
            </Link>
          </Button>
        )}
      </ButtonGroup>
    </Container>
  );
};

export default CropPicture;
