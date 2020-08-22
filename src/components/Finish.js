import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Container, Button, ButtonGroup, Input, FormGroup, Spinner } from 'reactstrap';
//= ==== Components ===== //
import {storage, db} from '../firebase/firebase';

//= ==== Store ===== //
import { selectCurrentWorkflow, saveCurrentWorkflow } from '../features/currentWorkflowSlice';
import { selectOriginalImageById } from '../features/images/originalImagesSlice';
import { selectCroppedImageById } from '../features/images/croppedImagesSlice';
import { selectImageDetailsById, saveImageDetails } from '../features/images/imageDetailsSlice';
import { selectImageLocationById } from '../features/images/imageLocationSlice';

//= ==== Style ===== //
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/Selfie.css';

const Finish = () => {
  const collectionRef = db.collection('spotting');
  const history = useHistory();
  const dispatch = useDispatch();
  const currentWorkflow = useSelector(selectCurrentWorkflow);
  //NOTE: these essentially act as reselectors. better way to take advantage of memoization?
  const originalImage   = useSelector((state) => selectOriginalImageById(state, currentWorkflow.wid));
  const croppedImage    = useSelector((state) => selectCroppedImageById(state, currentWorkflow.wid));
  const imageLocation   = useSelector((state) => selectImageLocationById(state, currentWorkflow.wid));
  const imageDetail     = useSelector((state) => selectImageDetailsById(state, currentWorkflow.wid));

  const [savingToCloud, setSavingToCloud] = useState();
  const [savedToCloud, setSavedToCloud] = useState();

  //
  const uploadToCloud = () => {
    setSavingToCloud(true);
    // create storage refs for images we want to save
    const files = [
      { ref: storage.ref(`/plant-images/${currentWorkflow.wid}_orig.png`), dataUrl:originalImage.imageDataURL },
      { ref: storage.ref(`/plant-images/${currentWorkflow.wid}_crop.png`), dataUrl:croppedImage.imageDataURL }
    ];
    // first, save all to cloud. then get remote urls for each image.
    // when done update local state.
    Promise.all(
      files.map((file) => {
        return file.ref.putString(file.dataUrl, 'data_url');
      })
    ).then(([origImgSnapshot, croppedImgSnapshot]) => {
        //console.log("finished uploads! origImgSnapshot:",origImgSnapshot,"\n croppedImgSnapshot:",croppedImgSnapshot);
        // use list of snapshot refs to get remote img urls.
        return Promise.all(
          [origImgSnapshot, croppedImgSnapshot].map(snapshot => snapshot.ref.getDownloadURL())
        ).then(([origImgUrl, croppedImgUrl]) => {
          //console.log("now save these: origImgUrl:",origImgUrl,"\n croppedImgUrl:",croppedImgUrl);
          dispatch(saveImageDetails({ id:currentWorkflow.wid, origImgUrl, croppedImgUrl }))
          return;
        })
      }
    )
    .then(() => collectionRef.add({...imageDetail, ...imageLocation}))
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(err =>
      console.warn(err)
    ).finally(() => {
      console.log("finally statement")
      dispatch(saveCurrentWorkflow({ completed: { finish: true }}));
      setSavingToCloud(false);
      setSavedToCloud(true);
      window.setTimeout(history.push('/success'), 500);
    });
  }

  return (
    <Container className="ocr-picture-screen">
      <h1>Finish</h1>
      <p>Double check the details and save to the cloud.</p>
      <div className="mb-3">
        <h4>Original Image</h4>
        {!!originalImage && <img className="preview-img" alt="" src={originalImage.imageDataURL} />}
      </div>
      <div className="cropped-picture">
        <h4>Cropped Image</h4>
        {!!croppedImage && <img className="preview-img" alt="" src={croppedImage.imageDataURL} />}
      </div>

      {imageDetail && imageLocation &&
        (
          <FormGroup className="mt-3">
            <h4>Plant Details</h4>
            <Input
              className="p-2 mb-2"
              value={imageDetail.latinName}
              type="text"
              disabled
            />
            <Input
              className="p-2 mb-2"
              value={imageDetail.commonName}
              type="text"
              disabled
            />
            <Input
              className="p-2 mb-2"
              value={imageDetail.price}
              type="text"
              disabled
            />
            <h4>Place Details</h4>
            <Input
              className="p-2 mb-2"
              value={imageLocation.name}
              type="text"
              disabled
            />
            <Input
              className="p-2 mb-2"
              value={imageLocation.address}
              type="text"
              disabled
            />
            <Button className="btn download-btn mt-3" color="primary" onClick={uploadToCloud} disabled={savingToCloud || savedToCloud}>
              {!savingToCloud && !savedToCloud
                && (
                  <>Looks Good. Save it. <FontAwesomeIcon icon={faCloudUploadAlt} /></>
                )
              }
              {savingToCloud
                && (
                  <>Saving it... <Spinner size="sm" color="light" /></>
                )
              }
              {!savingToCloud && savedToCloud
                && (
                  <>All Saved! <FontAwesomeIcon icon={faCloudUploadAlt} /></>
                )
              }
            </Button>
          </FormGroup>
        )}
      <ButtonGroup className="my-3 w-100">
        <Button>
          <Link className="back-navigation" to={{pathname: '/setPlace', state: { prevPath: window.location.pathname }}}>
            <FontAwesomeIcon icon={faAngleLeft} /> Back
          </Link>
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default Finish;
