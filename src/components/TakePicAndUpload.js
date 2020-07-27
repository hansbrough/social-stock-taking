import React, {useState, useEffect, useRef} from 'react';
import { createWorker } from 'tesseract.js';

import {storage} from '../firebase/firebase';
import '../styles/Selfie.css';

const TakePicAndUpload = () => {
  const [imageURL, setImageURL] = useState();
  const [ocr, setOcr] = useState();
  const [ocrStarted, setOcrStarted] = useState();

  const videoElem   = useRef(null);
  const canvasElem  = useRef(null);
  const imageElem   = useRef(null);
  const constraints = { facingMode: 'environment' };

  useEffect(() => {
    // listDevices();
    startCamera();
  });

  const worker = createWorker({
    logger: m => console.log(m),
  });

  const doOCR = async () => {
    setOcrStarted(true);
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(canvasElem.current);
    setOcr(text);
    setOcrStarted(false);
  };

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

  const takeSelfie = async () => {
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
    setImageURL(imageDataURL);
  }

  const backToCamera = () => {
    setImageURL();
    startCamera();
  }

  const uploadToCloud = () => {
    const uploadTask = storage.ref(`/test/selfie1.png`).putString(imageURL, 'data_url');
    uploadTask.on('state_changed',
    (snapShot) => {
      //takes a snap shot of the progress as it is happening
      console.log(snapShot)
    }, (err) => {
      //catches the errors
      console.log(err)
    })
  }

  // List cameras and microphones.
  // const listDevices = () => {
  //   navigator.mediaDevices.enumerateDevices()
  //   .then(function(devices) {
  //     devices.forEach(function(device) {
  //       console.log(device.kind + ": " + device.label +
  //                   " id = " + device.deviceId);
  //     });
  //   })
  //   .catch(function(err) {
  //     console.log(err.name + ": " + err.message);
  //   });
  // }

  return (
    <>
      <h1>Take a Picture</h1>
      <div className="selfie">
        {!imageURL
          && (
            <>
              <video ref={videoElem} autoPlay={true}></video>
              <button className="btn capture-btn" onClick={takeSelfie}>
                <i className="fa fa-camera" aria-hidden="true"></i>
              </button>
            </>
        )}

        <canvas ref={canvasElem} style={{display: 'none'}}></canvas>
        <div className="preview">
          <img className="preview-img" alt="" src={imageURL} ref={imageElem} />

          {imageURL
            && (
              <div className="btn-container">
                <button className="btn back-btn" onClick={backToCamera}>
                  <i className="fa fa-chevron-left" aria-hidden="true"></i>
                </button>
                <button className="btn download-btn" onClick={uploadToCloud}>
                  <i className="fa fa-upload" aria-hidden="true"></i>
                </button>
                <button className="btn-primary" onClick={doOCR}>Run OCR</button>
              </div>
            )}
        </div>
      </div>

      <section className="ocr-preview w-100">
      {ocr &&
        (
          <label>
            Here's a best guess at the text in your image. Please correct any mistakes.<br/>
            <input className="ocr-of-snapshot p-2 w-50" type="text" defaultValue={ocr} />
          </label>
        )
      }
      {ocrStarted && !ocr &&
        (
          <p>...loading</p>
        )
      }
      </section>
      <p><a href="/">Back Home</a></p>
    </>
  );
};

export default TakePicAndUpload;
