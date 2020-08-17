import React, {useState, useRef, useEffect} from "react";
import Cropper from "cropperjs";
import { Button } from 'reactstrap';

import "cropperjs/dist/cropper.min.css";
import "../styles/imagecropper.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

const ImageCropper = (
  {src, cb}
) => {
  const [croppedImageUrl, setCroppedImageUrl] = useState();
  const imageElement = useRef(null);
  // const croppedImageElem = useRef(null);
  const cropper = useRef(null);// set as ref to make available outside 'useEffect'

  // // Caman is global object installed via a library's script tag
  // const Caman = window.Caman;
  // const camanInstance = useRef(null);

  useEffect(() => {
    if(!cropper.current && imageElement.current) {
      imageElement.current.addEventListener('ready', function () {
        //console.log("!! ready:",this.cropper);
      });
      imageElement.current.addEventListener('cropend', (evt) => {
        //console.log("!! cropend:",evt.detail);
        const canvasElem = cropper.current.getCroppedCanvas();
        //canvasElem.filter='grayscale(100%)';
        //canvasElem.getContext('2d').filter = 'blur(5px) opacity(0.6)'
        //canvasElem.drawImage(this, 0, 0);
        //console.log("...canvasElem:",canvasElem)
        //setCroppedImage(cropper.current.getCroppedCanvas().toDataURL("image/png"))
        // below caman transfroms not working after first cropend
        //console.log("croppedImageElem.current:",croppedImageElem && croppedImageElem.current)
        //Caman('#croppedImage', function() {
        // Caman(croppedImageElem.current, function() {
        //   console.log("!!!!!")
        //   this.greyscale();
        //   this.clip(20);
        //   this.render();
        // });
        setCroppedImageUrl(canvasElem.toDataURL("image/png"))
      });
      cropper.current = new Cropper(imageElement.current);
    }
  },[imageElement])

  // useEffect(() => {
  //   console.log("useEffect 2",)
  //   if(croppedImageUrl && !camanInstance.current) {
  //     console.log("...camanInstance.current does NOT exist")
  //
  //     camanInstance.current = Caman('#filteredImage', croppedImageUrl, function() {
  //       this.greyscale();
  //       this.stackBlur(1);
  //       this.clip(30);
  //       this.render();
  //     });
  //   }
  // },[croppedImageUrl, Caman, camanInstance]);

  // return cropped image to parent component
  useEffect(() => {
    if(cb && croppedImageUrl) {
      cb(croppedImageUrl);
    }
  },[cb, croppedImageUrl]);

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
      <div className="mt-2">
        <Button className="mr-2" onClick={rotateLeft}><FontAwesomeIcon icon={faUndo} /> rotate left</Button>
        <Button onClick={rotateRight}>rotate right <FontAwesomeIcon icon={faUndo} /></Button>
      </div>
      {croppedImageUrl && (
        <img src={croppedImageUrl} className="img-preview mt-3" id="croppedImage" alt="Cropped version" />
      )}
    </>
  );
}

export default ImageCropper;
