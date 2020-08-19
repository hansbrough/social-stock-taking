import React, {useState, useRef, useEffect} from "react";
import {useDispatch} from 'react-redux';
import Cropper from "cropperjs";
import { Button, ButtonGroup } from 'reactstrap';

import { saveCroppedImage } from '../features/images/croppedImagesSlice';

import "cropperjs/dist/cropper.min.css";
import "../styles/imagecropper.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

const ImageCropper = (
  {src}
) => {
  const dispatch = useDispatch();
  const [croppedImageUrl, setCroppedImageUrl] = useState();
  const imageElement = useRef(null);
  const cropper = useRef(null);// set as ref to make available outside 'useEffect'

  useEffect(() => {
    if(!cropper.current && imageElement.current) {
      // listen for cropper events on the image element
      imageElement.current.addEventListener('ready', function () {
        //console.log("!! ready:",this.cropper);
        cropper.current.crop();
      });
      imageElement.current.addEventListener('crop', (evt) => {
        //console.log("!! crop:",evt.detail);
        const canvasElem = cropper.current.getCroppedCanvas();
        setCroppedImageUrl(canvasElem.toDataURL("image/png"))
      });
      imageElement.current.addEventListener('cropend', (evt) => {
        //console.log("!! cropend:",evt.detail);
        const canvasElem = cropper.current.getCroppedCanvas();
        setCroppedImageUrl(canvasElem.toDataURL("image/png"))
      });
      // Create the cropper instance
      cropper.current = new Cropper(imageElement.current);
    }
  },[imageElement])

  // save croppedImage URL to store for use by other components
  useEffect(() => {
    if(croppedImageUrl) {
      dispatch(saveCroppedImage({ id: 'me', imageDataURL: croppedImageUrl }))
    }
  },[croppedImageUrl]);

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
