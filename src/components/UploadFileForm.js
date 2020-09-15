import React, {useState, useRef, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Container, FormGroup, ButtonGroup, Button, Input,
} from 'reactstrap';
//import Select from 'react-select';
//= ==== Constants ===== //
//= ==== Components ===== //
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
  const [imageFile, setImageFile] = useState();
  const [imageDataURL, setImageDataURL] = useState();
  const fileInputElem = useRef(null);

  // get a file preview before upload to remote bucket
  const reader  = new FileReader();


  reader.onloadend = function () {
    // console.log("reader.onloadend reader.result:",reader.result)
    setImageDataURL(reader.result)
  }

  // when user starts a new workflow - assign a unique id.
  useEffect(() => {
    // console.log("useEffect workflow updated:",currentWorkflow);
    if( currentWorkflow && (!currentWorkflow.wid || currentWorkflow.completed.finish) ) {
      dispatch(saveCurrentWorkflow({ wid: makeWorkflowUid() }));
    }
  },[currentWorkflow, dispatch]);

  // once local image file has been read
  useEffect(() => {
    if (imageFile) {
      reader.readAsDataURL(imageFile);
    }
  },[reader, imageFile]);

  useEffect(() => {
    if(imageDataURL) {
      dispatch(save({ id: currentWorkflow.wid, imageDataURL }));
      dispatch(saveCurrentWorkflow({ completed: { takePicture: true }}));
    }
  },[dispatch, currentWorkflow, imageDataURL]);

  const handleImageFile = (e) => {
    setImageFile(e.target.files[0]);
  }

  // cleanup before going back to home
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
  // reset
  // const handleCancelClick = e => {
  //   console.log("handleCancelClick fileInputElem:",fileInputElem.current)
  //   e.preventDefault();
  //   setImageFile();
  //   setImageDataURL();
  //   fileInputElem.current.value = ''; // TODO: this not clearing input value..
  // }

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
          {imageDataURL
            && (
              <Button color="primary" onClick={() => history.push({
                  pathname: '/cropPicture'
                })}
              >
                Crop <FontAwesomeIcon icon={faAngleRight} />
              </Button>
            )}
        </ButtonGroup>
      </FormGroup>
    </Container>
  );
};

export default UploadFileForm;
