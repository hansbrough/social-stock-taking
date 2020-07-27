import React, {useState, useRef, useEffect} from "react";
import Cropper from "cropperjs";
// import {
//   Container, Row, Col,
// } from 'reactstrap';

import "cropperjs/dist/cropper.min.css";
import "../styles/imagecropper.css";

const ImageCropper = (
  {src, cb}
) => {
  const [croppedImage, setCroppedImage] = useState();
  const imageElement = useRef(null);
  let cropper;

  useEffect(() => {
    if(!cropper && imageElement.current) {
      // imageElement.current.addEventListener('ready', function () {
      //   console.log("!! ready:",this.cropper);
      // });
      imageElement.current.addEventListener('cropend', (evt) => {
        //console.log("!! cropend:",evt.detail);
        setCroppedImage(cropper.getCroppedCanvas().toDataURL("image/png"))
      });
      cropper = new Cropper(imageElement.current);
    }
  },[imageElement])

  // return cropped image to parent component
  useEffect(() => {
    if(cb && croppedImage) {
      cb(croppedImage);
    }
  },[cb, croppedImage]);

  return (
    <>
      <div className="img-container">
        <img ref={imageElement} src={src} alt="Source" />
      </div>
      {croppedImage && (
        <img src={croppedImage} className="img-preview mt-3" alt="Cropped version" />
      )}
    </>
  );
}

export default ImageCropper;
