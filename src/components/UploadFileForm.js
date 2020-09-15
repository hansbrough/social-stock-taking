import React, {useState, useRef, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Container, FormGroup, ButtonGroup, Button, Input,
} from 'reactstrap';
//= ==== Utils ===== //
import { makeWorkflowUid } from '../utils/SessionUtil';
//= ==== Store ===== //
import { selectCurrentWorkflow, saveCurrentWorkflow, resetCurrentWorkflow } from '../features/currentWorkflowSlice';
import { save, remove } from '../features/images/originalImagesSlice';
import { removeProcessedImage } from '../features/images/processedImagesSlice';
import { removeCroppedImage } from '../features/images/croppedImagesSlice';
import { removeImageLocation } from '../features/images/imageLocationSlice';
import { removeImageDetails } from '../features/images/imageDetailsSlice';
//= ==== Style ===== //
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

const UploadFileForm = () => {
  const history         = useHistory();
  const dispatch        = useDispatch();
  const currentWorkflow = useSelector(selectCurrentWorkflow);
  const [imageDataURL, setImageDataURL] = useState();
  const fileInputElem = useRef(null);

  // get a file preview before upload to remote bucket
  const reader  = new FileReader();

  // once local file converted to dataURL - reduce size
  // perf improvement for devices with w/fewer resources during cropping
  reader.onloadend = function () {
    //console.log("reader.onloadend");
    const img = new Image();
    img.src = reader.result;
    img.onload = () => {
      const width = img.width / 2;
      const height = img.height / 2;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      const canvasDataURL = canvas.toDataURL('image/jpeg');//default 'image/png' produces larger files
      //console.log("...canvasDataURL:",canvasDataURL);
      dispatch(save({ id: currentWorkflow.wid, imageDataURL: canvasDataURL }));
      dispatch(saveCurrentWorkflow({ completed: { uploadFile: true }}));
      setImageDataURL(canvasDataURL);
    }
  }

  // when user starts a new workflow - assign a unique id.
  useEffect(() => {
    // console.log("useEffect workflow updated:",currentWorkflow);
    if( currentWorkflow && (!currentWorkflow.wid || currentWorkflow.completed.finish) ) {
      dispatch(saveCurrentWorkflow({ wid: makeWorkflowUid() }));
    }
  },[currentWorkflow, dispatch]);

  const handleImageFile = (e) => {
    reader.readAsDataURL(e.target.files[0]);
  }

  // cleanup before going back to home
  // TODO: also cleanup when user changes the selected file
  // and batch the dispatch cmds?
  const backToHome = () => {
    const {wid} = {...currentWorkflow};
    dispatch(remove({ wid }));
    dispatch(removeProcessedImage({ wid }));
    dispatch(removeCroppedImage({ wid }));
    dispatch(removeImageLocation({ wid }));
    dispatch(removeImageDetails({ wid }));
    dispatch(resetCurrentWorkflow());
    history.goBack()
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
      </FormGroup>

      <FormGroup className="ocr-preview w-100 my-3">
        <img className="preview-img" alt="" src={imageDataURL} />

        <ButtonGroup className="mt-2 w-100" size="lg">
          <Button className="back-btn" onClick={() => backToHome()}>
            <FontAwesomeIcon icon={faAngleLeft} /> Home
          </Button>
          <Button color="primary" disabled={!imageDataURL} onClick={() => history.push({
              pathname: '/cropPicture'
            })}
          >
            Crop <FontAwesomeIcon icon={faAngleRight} />
          </Button>
        </ButtonGroup>
      </FormGroup>
    </Container>
  );
};

export default UploadFileForm;
