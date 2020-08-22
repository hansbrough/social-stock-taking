import React, {useState, useRef, useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux';
import Cropper from "cropperjs";
import { Button, ButtonGroup } from 'reactstrap';
//= ==== Store ===== //
import { selectCurrentWorkflow } from '../features/currentWorkflowSlice';
import { saveCroppedImage } from '../features/images/croppedImagesSlice';
//= ==== Style ===== //
import "cropperjs/dist/cropper.min.css";
import "../styles/imagecropper.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

const ImageCropper = (
  {
    src,
    save,
    eventConnector = () => {},
  }
) => {
  const dispatch = useDispatch();
  const currentWorkflow = useSelector(selectCurrentWorkflow);
  const [croppedImageUrl, setCroppedImageUrl] = useState();
  const imageElement = useRef(null);
  const cropper = useRef(null);// set as ref to make available outside 'useEffect'

  useEffect(() => {
    if(!cropper.current && imageElement.current) {
      // listen for cropper events on the image element
      imageElement.current.addEventListener('ready', function () {
        //console.log("!! ready:",this.cropper);
        cropper.current.crop();
        const canvasElem = cropper.current.getCroppedCanvas();
        setCroppedImageUrl(canvasElem.toDataURL("image/png"))
      });
      imageElement.current.addEventListener('crop', (evt) => {
        //console.log("!! crop:",evt.detail);
        // updating onscreen img on every crop event is very sloooooow
      });
      imageElement.current.addEventListener('cropend', (evt) => {
        //console.log("!! cropend:",evt.detail);
        const canvasElem = cropper.current.getCroppedCanvas();
        setCroppedImageUrl(canvasElem.toDataURL("image/png"))
      });
      // Create the cropper instance
      cropper.current = new Cropper(imageElement.current);
      //
      eventConnector(imageElement.current);
    }
  },[imageElement, eventConnector]);

  // save croppedImage URL to store for use by other components
  // avoid *excessive store operations* by watching for 'save' prop passed in from parent
  // else actions dispatched multiple times as user drags cropping tool.
  useEffect(() => {
    if(croppedImageUrl && save) {
      dispatch(saveCroppedImage({ id: currentWorkflow.wid, imageDataURL: croppedImageUrl }))
    }
  },[croppedImageUrl, save]);

  const rotateLeft = evt => {
    cropper && cropper.current.rotate(-2)
  }

  const rotateRight = evt => {
    cropper && cropper.current.rotate(2)
  }

  return (
    <>
      <div className="img-container">
        <img ref={imageElement} src={src} alt="Source" />
      </div>
      <ButtonGroup className="mt-2 w-100">
        <Button onClick={rotateLeft}><FontAwesomeIcon icon={faUndo} /> rotate left</Button>
        <Button onClick={rotateRight}>rotate right <FontAwesomeIcon icon={faUndo} /></Button>
      </ButtonGroup>
      {croppedImageUrl && (
        <img src={croppedImageUrl} className="img-preview mt-3" id="croppedImage" alt="Cropped version" />
      )}
    </>
  );
}

export default ImageCropper;
