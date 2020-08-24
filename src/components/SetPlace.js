/*global google*/
import React, {useState, useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Container, Button, ButtonGroup,
  Spinner, FormGroup, Input
} from 'reactstrap';
import Select from 'react-select';
//= ==== Components ===== //

//import {storage} from '../firebase/firebase';
//= ==== Store ===== //
import { selectCurrentWorkflow, saveCurrentWorkflow } from '../features/currentWorkflowSlice';
import { selectOriginalImageById } from '../features/images/originalImagesSlice';
import { saveImageLocation } from '../features/images/imageLocationSlice';

//= ==== Style ===== //
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import '../styles/Selfie.css';

const SetPlace = () => {
  const dispatch = useDispatch();
  const currentWorkflow = useSelector(selectCurrentWorkflow);
  const originalImage   = useSelector((state) => selectOriginalImageById(state, currentWorkflow.wid));

  const [position, setPosition] = useState();
  const [placeHint, setPlaceHint] = useState();
  const [currentPlaceOption, setCurrentPlaceOption] = useState();// made for react-select
  const [placeOptions, setPlaceOptions] = useState();// made for react-select
  const [placeSearching, setPlaceSearching] = useState();
  const [placesServiceResponse, setPlacesServiceResponse] = useState();

  // create a version of google's places service to make api calls on our behalf
  const placesService = new google.maps.places.PlacesService(document.createElement('div'))

  // uses id of selected option to create an object representing the location ('place')
  // 'useCallback' ensures this method will only run when one of it's dependenies updates.
  const createImageLocationPayload = useCallback((selectedOption) => {
    //console.log("createImageLocationPayload selectedOption:",selectedOption)
    const selectedPlaceDetails = placesServiceResponse.find(item => item.place_id === selectedOption.value);
    // note: GeolocationCoordinates interface doesnt support spread syntax :(
    return { id:currentWorkflow.wid, lat:position.coords.latitude, lng:position.coords.longitude, ...selectedPlaceDetails};
  },[currentWorkflow.wid, position, placesServiceResponse])

  // do once place options have been set/changed in select widget
  useEffect(() => {
    if (placeOptions) {
      //console.log("useEffect placeOptions changed:",placeOptions);
      setCurrentPlaceOption(placeOptions[0]);
      const payload = createImageLocationPayload(placeOptions[0]);
      dispatch(saveImageLocation(payload));
    }
  },[placeOptions, createImageLocationPayload, dispatch]);

  // store the user entered place hint
  const handlePlaceHintChange = evt => {
    setPlaceHint(evt.target.value);
  }

  const handlePlaceSelectChange = selectedOption => {
    //console.log("handlePlaceSelectChange:",selectedOption)
    setCurrentPlaceOption(selectedOption);
    const payload = createImageLocationPayload(selectedOption);
    dispatch(saveImageLocation(payload));
    dispatch(saveCurrentWorkflow({ completed: { setPlace: true }}));
  }

  const handleFindLocationClick = evt => {
    //console.log("handleFindLocationClick placeHint:",placeHint);
    setPlaceSearching(true);
    navigator.geolocation.getCurrentPosition((position) => {
      //console.log("..geo position:",position.coords);
      setPosition(position);
      // use position to find a 'place' via google maps
      placesService.findPlaceFromQuery({
        query: placeHint,
        locationBias: { lat: position.coords.latitude, lng: position.coords.longitude },
        fields:['place_id','name','formatted_address'],
      }, places => {
        //console.log("gmaps places result:",places);
        setPlacesServiceResponse(places);
        setPlaceOptions(places && places.map(place => {
          return {value: place.place_id, label: `${place.name}, ${place.formatted_address}`}
        }));
        setPlaceSearching(false);
      });
    });
  }

  return (
    <Container className="ocr-picture-screen">
      <h1>Set Place</h1>
      <p>Where did you find this plant?</p>
      <div className="original-picture">
        <div className="preview">
          {!!originalImage && <img className="preview-img" alt="" src={originalImage.imageDataURL} />}
        </div>
      </div>

      <FormGroup className="mt-3">
        <label className="w-100">
          <span className="d-inline-block mb-2"><b>Give us a hint</b> - enter some or all of the store name</span>
          <Input
            className="p-2 mb-3"
            type="text"
            onChange={handlePlaceHintChange}
            placeholder="Enter a store name hint"
          />
        </label>
        <Button
          color="primary"
          className="d-block mb-3"
          disabled={!placeHint}
          onClick={handleFindLocationClick}
        >
          {!placeSearching && (<span>Find your location</span>)}
          {placeSearching
            && (
              <><Spinner size="sm" color="light" /> Searching...</>
            )
          }
        </Button>
        <div id="placesContainer"></div>
        {placeOptions &&
          (
            <>
            <span className="d-inline-block mb-2"><b>Found something!</b> Select the matching store</span>
            <Select
              value={currentPlaceOption}
              onChange={handlePlaceSelectChange}
              options={placeOptions}
            />
            </>
          )
        }
      </FormGroup>

      <ButtonGroup className="my-3 w-100">
        <Button>
          <Link className="back-navigation" to={{pathname: '/getPictureText', state: { prevPath: window.location.pathname }}}>
            <FontAwesomeIcon icon={faAngleLeft} /> Back
          </Link>
        </Button>
        <Button disabled={!currentPlaceOption} color="primary">
          <Link className="back-navigation" to={{pathname: '/finish', state: { prevPath: window.location.pathname }}}>
            Finish <FontAwesomeIcon icon={faAngleRight} />
          </Link>
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default SetPlace;
