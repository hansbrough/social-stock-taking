import React, {useState, useRef, useEffect} from 'react';
import {
  Container,
  Form, FormGroup, Button, Input,
  Progress,
} from 'reactstrap';
import { createWorker } from 'tesseract.js';
//= ==== Components ===== //
import {storage} from '../firebase/firebase';
import ImageCropper from './imageCropper';

const UploadFileForm = () => {
  const [imageFile, setImageFile] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [croppedImageUrl, setCroppedImageUrl] = useState();
  const [ocr, setOcr] = useState();
  const [ocrStarted, setOcrStarted] = useState();
  const [ocrProgress, setOcrProgress] = useState();
  // const imageElem  = useRef(null);
  const fileInputElem = useRef(null);

  // get a file preview before upload to remote bucket
  const reader  = new FileReader();
  reader.onloadend = function () {
    // console.log("reader.onloadend reader.result:",reader.result)
    setImageUrl(reader.result)
  }

  useEffect(() => {
    if (imageFile) {
      reader.readAsDataURL(imageFile);
    }
  },[reader, imageFile]);

  const worker = createWorker({
    logger: m => m.jobId && setOcrProgress(Math.round(m.progress*100)),
  });

  const doOCR = async () => {
    console.log("doOCR");
    setOcrStarted(true);
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(croppedImageUrl);
    setOcr(text);
    setOcrStarted(false);
  };

  const handleImageFile = (e) => {
    setImageFile(e.target.files[0]);
  }

  const handleFireBaseUpload = e => {
    e.preventDefault();
    if (!imageFile) {
      console.error(`not an image, the image file is a ${typeof(imageFile)}`)
    }
    const uploadTask = storage.ref(`/test/${imageFile.name}`).put(imageFile)
    //initiates the firebase side uploading
    uploadTask.on('state_changed',
    (snapShot) => {
      //takes a snap shot of the progress as it is happening
      console.log(snapShot)
    }, (err) => {
      //catches the errors
      console.log(err)
    }, () => {
      //
      storage.ref('test').child(imageFile.name).getDownloadURL()
       .then(fireBaseUrl => {
         console.log("fireBaseUrl:",fireBaseUrl);
         setImageUrl(fireBaseUrl)
       })
    })
  }

  // this essentially a reset
  const handleCancelClick = e => {
    console.log("handleCancelClick fileInputElem:",fileInputElem.current)
    e.preventDefault();
    setOcr();
    setImageFile();
    setImageUrl();
    setOcrProgress();
    fileInputElem.current.value = ''; // TODO: this not clearing input value..
  }

  // const handleResetClick = evt => {
  //   setOcr();
  //   setOcrProgress();
  //   setCroppedImageUrl();
  // }

  const handleOcrInputChange = evt => {
    setOcr(evt.target.value);
  }

  return (
    <Container>
      <h1>Upload Image</h1>
      <FormGroup>
        <Input
          type="file"
          ref={fileInputElem}
          className="mb-3"
          onChange={handleImageFile}
        />
        {imageUrl && <ImageCropper src={imageUrl} cb={setCroppedImageUrl} />}
      </FormGroup>

      { imageFile
        && (
          <FormGroup>
            <Button color="primary" onClick={doOCR} className="mr-2" disabled={ocrStarted }>Run OCR</Button>
          </FormGroup>
        )
      }

      <FormGroup className="ocr-preview w-100 my-3">
      {ocr &&
        (
          <Form onSubmit={handleFireBaseUpload}>
          <FormGroup>
            <label>
              Here's a best guess at the text in your image. Please correct any mistakes.<br/>
              <Input
                className="ocr-of-snapshot p-2 w-100"
                type="textarea"
                value={ocr}
                style={{minHeight:'10rem'}}
                onChange={handleOcrInputChange}
              />
            </label>
            <div>
              <Button color="primary" className="mr-2">Save</Button>
              <Button color="secondary" onClick={handleCancelClick} className="mr-2">Cancel</Button>
            </div>
          </FormGroup>
          </Form>
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
      </FormGroup>
      <p><a href="/">Back To Home</a></p>
    </Container>
  );
};

export default UploadFileForm;
