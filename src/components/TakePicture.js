import React, {useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup } from 'reactstrap';
//= ==== Components ===== //
//= ==== Utils ===== //
import { makeWorkflowUid } from '../utils/SessionUtil';
//= ==== Store ===== //
import { selectCurrentWorkflow, saveCurrentWorkflow } from '../features/currentWorkflowSlice';
import { save, reset, selectOriginalImages } from '../features/images/originalImagesSlice';
//= ==== Style ===== //
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import '../styles/Selfie.css';

const TakePicture = () => {
  const dispatch        = useDispatch();
  const originalImages  = useSelector(selectOriginalImages);
  const currentWorkflow = useSelector(selectCurrentWorkflow);
  const videoElem       = useRef(null);
  const canvasElem      = useRef(null);

  const constraints     = { facingMode: 'environment' };
  //

  useEffect(() => {
    //console.log("useEffect workflow updated:",currentWorkflow);
    if( currentWorkflow && !currentWorkflow.wid ) {
      // console.log("...currentWorkflow needs an id!");
      dispatch(saveCurrentWorkflow({ wid: makeWorkflowUid() }));
    }
  },[currentWorkflow, dispatch]);

  useEffect(() => {
    startCamera();
  });

  const startCamera = async () => {
    try {
      const stream =  await navigator.mediaDevices.getUserMedia({
          video: constraints
      });

      if(videoElem.current) {
        videoElem.current.srcObject = stream;
      }

    } catch(err) {
      console.log(err);
    }
  }

  const stopCamera = () => {
    const stream = videoElem.current.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach(track => {
      track.stop();
    });
  }

  const takePicture = async () => {
    // Get the exact size of the video element.
    const width = videoElem.current.videoWidth;
    const height = videoElem.current.videoHeight;

    // get the context object of hidden canvas
    const ctx = canvasElem.current.getContext('2d');

    // Set the canvas to the same dimensions as the video.
    canvasElem.current.width = width;
    canvasElem.current.height = height;

    // Draw the current frame from the video on the canvas.
    ctx.drawImage(videoElem.current, 0, 0, width, height);

    // Get an image dataURL from the canvas.
    const imageDataURL = canvasElem.current.toDataURL('image/png');

    // Set the dataURL as source of an image element, showing the captured photo.
    stopCamera();
    dispatch(save({ id: currentWorkflow.wid, imageDataURL }));
    dispatch(saveCurrentWorkflow({ completed: { takePicture: true }}));
  }

  const backToCamera = () => {
    dispatch(reset());
    startCamera();
  }

  return (
    <>
      <h1 className="ml-3">Take a Picture</h1>
      <p className="ml-3">Frame the plant with it's label visible.</p>
      <div className="original-picture">
        {!originalImages.length
          && (
            <>
              <video className="mb-3" ref={videoElem} autoPlay={true}></video>
              <Button className="capture-btn" onClick={takePicture}>
                <FontAwesomeIcon icon={faCamera} />
              </Button>
            </>
        )}

        <canvas ref={canvasElem} style={{display: 'none'}}></canvas>
        <div className="preview">
          {!!originalImages.length && <img className="preview-img" alt="" src={originalImages[0].imageDataURL} />}

          {!!originalImages.length
            && (
              <ButtonGroup className="mt-2 w-100" size="lg">

                <Button className="back-btn" onClick={backToCamera}>
                  <FontAwesomeIcon icon={faCamera} /> Retake
                </Button>

              </ButtonGroup>
            )}
        </div>
      </div>

      <Button className="ml-3 mt-5">
        <Link className="back-navigation" to={{pathname: '/', state: { prevPath: window.location.pathname }}}>
          <FontAwesomeIcon icon={faAngleLeft} /> Home
        </Link>
      </Button>

      {!!originalImages.length
        && (
        <Button className="ml-2 mt-5" color="primary">
          <Link className="back-navigation" to={{pathname: '/cropPicture', state: { prevPath: window.location.pathname }}}>
            Crop <FontAwesomeIcon icon={faAngleRight} />
          </Link>
        </Button>
      )}
    </>
  );
};

export default TakePicture;
