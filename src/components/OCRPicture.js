import React, {useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Link } from 'react-router-dom';
import { createWorker } from 'tesseract.js';
import { Container, Button, ButtonGroup, Progress } from 'reactstrap';
//= ==== Components ===== //

//import {storage} from '../firebase/firebase';

import { selectCroppedImages } from '../features/images/croppedImagesSlice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/Selfie.css';

const OCRPicture = () => {
  const dispatch = useDispatch();
  const croppedImages = useSelector(selectCroppedImages);
  //const [imageURL, setImageURL] = useState();
  //const [croppedImageUrl, setCroppedImageUrl] = useState();
  const [processedImageUrl, setProcessedImageUrl] = useState();
  const [ocr, setOcr] = useState();
  const [ocrStarted, setOcrStarted] = useState();
  const [ocrProgress, setOcrProgress] = useState();

  const canvasElem      = useRef(null);
  // const imageElem       = useRef(null);
  const ocrTextareaElem = useRef(null);

  // Caman is global object installed via a library's script tag
  const Caman = window.Caman;

  // do something once cropped image has been pre-processed
  useEffect(() => {
    processedImageUrl && runOCR(processedImageUrl);
  },[processedImageUrl]);

  // attempt to make image more readable by OCR
  const preProcessOCRImage = () => {
    console.log("preProcessOCRImage")
    Caman('#filteredImage', croppedImages[0].imageDataURL, function() {
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

  //
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

  // const uploadToCloud = () => {
  //   const uploadTask = storage.ref(`/test/selfie1.png`).putString(originalImages[0].imageDataURL, 'data_url');
  //   uploadTask.on('state_changed',
  //   (snapShot) => {
  //     //takes a snap shot of the progress as it is happening
  //     console.log(snapShot)
  //   }, (err) => {
  //     //catches the errors
  //     console.log(err)
  //   })
  // }

  const handleOcrInputChange = evt => {
    setOcr(evt.target.value);
  }

  return (
    <Container className="ocr-picture-screen">
      <h1 className="ml-3">Get Picture Text</h1>
      <div className="original-picture">

        <canvas ref={canvasElem} style={{display: 'none'}}></canvas>
        <div className="preview">
          {!!croppedImages.length && <img className="preview-img" alt="" src={croppedImages[0].imageDataURL} />}

          <canvas id="filteredImage" className="d-none"></canvas>
          {!!croppedImages.length
            && (
              <ButtonGroup className="mt-2 w-100" size="lg">
                <Button onClick={getImageText}>
                  <FontAwesomeIcon icon={faFileAlt} /> Get Text
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
      <Button className="ml-3 mt-5">
        <Link className="back-navigation" to={{pathname: '/cropPicture', state: { prevPath: window.location.pathname }}}>
          <FontAwesomeIcon icon={faAngleLeft} /> Back
        </Link>
      </Button>
    </Container>
  );
};

export default OCRPicture;
