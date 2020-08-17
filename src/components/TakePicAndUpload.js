import React, {useState, useEffect, useRef} from 'react';
import { createWorker } from 'tesseract.js';
import { Button, ButtonGroup, Progress } from 'reactstrap';
//= ==== Components ===== //
import ImageCropper from './imageCropper';
import {storage} from '../firebase/firebase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faAngleLeft, faCloudUploadAlt, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/Selfie.css';

const TakePicAndUpload = () => {
  const [imageURL, setImageURL] = useState();
  const [croppedImageUrl, setCroppedImageUrl] = useState();
  const [processedImageUrl, setProcessedImageUrl] = useState();
  const [ocr, setOcr] = useState();
  const [ocrStarted, setOcrStarted] = useState();
  const [ocrProgress, setOcrProgress] = useState();

  const videoElem       = useRef(null);
  const canvasElem      = useRef(null);
  // const imageElem       = useRef(null);
  const ocrTextareaElem = useRef(null);
  const constraints = { facingMode: 'environment' };

  // Caman is global object installed via a library's script tag
  const Caman = window.Caman;

  useEffect(() => {
    // listDevices();
    startCamera();
  });

  // do something once cropped image has been pre-processed
  useEffect(() => {
    processedImageUrl && runOCR(processedImageUrl);
  },[processedImageUrl]);

  // attempt to make image more readable by OCR
  const preProcessOCRImage = () => {
    console.log("preProcessOCRImage")
    Caman('#filteredImage', croppedImageUrl, function() {
          this.greyscale();
          this.sharpen(100);
          //this.threshold(80);
          //this.contrast(60)
          //this.stackBlur(1);
          this.render(function(){
            //const processedImg = this.toBase64();
            setProcessedImageUrl(this.toBase64());
          });
        });
  }

  const worker = createWorker({
    logger: m => m.jobId && setOcrProgress(Math.round(m.progress*100)),
  });

  const runOCR = async (imageUrl) => {
    console.log("runOCR");
    setOcrStarted(true);
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(imageUrl);
    setOcr(text);
    setOcrStarted(false);
  };

  const getImageText = evt => {
    preProcessOCRImage();
  }

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

  const handleOcrInputChange = evt => {
    setOcr(evt.target.value);
  }

  return (
    <>
      <h1>Take a Picture</h1>
      <div className="selfie">
        {!imageURL
          && (
            <>
              <video ref={videoElem} autoPlay={true}></video>
              <Button className="btn capture-btn" onClick={takeSelfie}>
                <FontAwesomeIcon icon={faCamera} />
              </Button>
            </>
        )}

        <canvas ref={canvasElem} style={{display: 'none'}}></canvas>
        <div className="preview">
          {/*<img className="preview-img" alt="" src={imageURL} ref={imageElem} */}
          {imageURL && <ImageCropper src={imageURL} cb={setCroppedImageUrl} />}
          <canvas id="filteredImage" className="d-none"></canvas>
          {imageURL
            && (
              <ButtonGroup className="mt-2 w-100" size="lg">
                <Button className="btn" onClick={getImageText}>
                  <FontAwesomeIcon icon={faFileAlt} /> Get Text
                </Button>
                <Button className="btn back-btn" onClick={backToCamera}>
                  <FontAwesomeIcon icon={faAngleLeft} /> Retake
                </Button>
                <Button className="btn download-btn" onClick={uploadToCloud}>
                  <FontAwesomeIcon icon={faCloudUploadAlt} /> Upload
                </Button>
              </ButtonGroup>
            )}
        </div>
      </div>

      <section className="ocr-preview w-100">
      {ocr &&
        (
          <label>
            Here's a best guess at the text in the image.<br/>
            <input
              className="ocr-of-snapshot p-2 w-50"
              type="textarea"
              value={ocr}
              style={{minHeight:'10rem'}}
              onChange={handleOcrInputChange}
              ref={ocrTextareaElem}
            />
          </label>
        )
      }
      {ocrStarted && !ocrProgress &&
        (
          <span>Preparing Image...</span>
        )
      }
      {ocrStarted && ocrProgress &&
        (
          <Progress max="100" value={ocrProgress}>{ocrProgress && `${ocrProgress}%`}</Progress>
        )
      }
      </section>
      <p className="mt-2"><a href="/">Back Home</a></p>
    </>
  );
};

export default TakePicAndUpload;
