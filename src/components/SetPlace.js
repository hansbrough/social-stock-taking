/*global google*/
import React, {useState, useEffect, useRef} from 'react';
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
import { selectOriginalImages } from '../features/images/originalImagesSlice';
import { saveImageLocation } from '../features/images/imageLocationSlice';

//= ==== Style ===== //
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import '../styles/Selfie.css';

const SetPlace = () => {
  const dispatch = useDispatch();
  const currentWorkflow = useSelector(selectCurrentWorkflow);
  const originalImages  = useSelector(selectOriginalImages);

  const [position, setPosition] = useState();
  const [placeHint, setPlaceHint] = useState();
  const [place, setPlace] = useState();
  const [places, setPlaces] = useState();
  const [placeSearching, setPlaceSearching] = useState();
  const [placesServiceResponse, setPlacesServiceResponse] = useState();

  // create a version of google's places service to make api calls on our behalf
  const placesService = new google.maps.places.PlacesService(document.createElement('div'))

  // do once places known
  useEffect(() => {
    if (places) {
      setPlace(places[0]);
    }
  },[places]);

  // do something once ...
  useEffect(() => {

  },[]);

  // store the user entered place hint
  const handlePlaceHintChange = evt => {
    setPlaceHint(evt.target.value);
  }

  const handlePlaceSelectChange = selectedOption => {
    //console.log("handlePlaceSelectChange:",selectedOption)
    setPlace(selectedOption);
    //console.log("...placesServiceResponse:",placesServiceResponse);
    const selectedPlaceDetails = placesServiceResponse.find(item => item.place_id === selectedOption.value);
    //console.log("...position:",position);
    //console.log("...selectedPlaceDetails:",selectedPlaceDetails);
    // note: GeolocationCoordinates interface doesnt support spread syntax :(
    const payload = { id:currentWorkflow.wid, lat:position.coords.latitude, lng:position.coords.longitude, ...selectedPlaceDetails};
    //console.log("...payload:",payload)
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
        setPlaces(places && places.map(place => {
          return {value: place.place_id, label: `${place.name}, ${place.formatted_address}`}
        }));

        if (places && places.length) {
          if(places.length === 1) {
            // show a single result
            places[0].name && setPlace(`${places[0].name}, ${places[0].formatted_address}`);
          } else {
            // display selector
          }
        } else {
          // no results
        }
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
          {!!originalImages.length && <img className="preview-img" alt="" src={originalImages[0].imageDataURL} />}
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
        {places &&
          (
            <>
            <span className="d-inline-block mb-2"><b>Found something!</b> Select the matching store</span>
            <Select
              value={place}
              onChange={handlePlaceSelectChange}
              options={places}
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
        <Button disabled={!place} color="primary">
          <Link className="back-navigation" to={{pathname: '/finish', state: { prevPath: window.location.pathname }}}>
            Finish <FontAwesomeIcon icon={faAngleRight} />
          </Link>
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default SetPlace;
