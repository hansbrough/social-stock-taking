/*global google*/
import React, {useState, useRef, useEffect} from 'react';
import {useSelector} from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Container,
  Form, FormGroup, Button, Input,
  Progress, Spinner,
} from 'reactstrap';
import Select from 'react-select';
import { createWorker } from 'tesseract.js';
// import * as GoogleMapsAPI from '../apis/GoogleMapsAPI'; // ran into CORS issues
//= ==== Constants ===== //
import RegexConstants from '../constants/RegexConstants';
//= ==== Components ===== //
import {storage} from '../firebase/firebase';
import ImageCropper from './imageCropper';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
//= ==== Utils ===== //
import keywords from '../utils/aloe_keywords';
//= ==== Dev ===== //
import {
  selectAloes
} from '../features/plants/plantsSlice';


const UploadFileForm = () => {
  const aloePlants = useSelector(selectAloes);

  const [imageFile, setImageFile] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [croppedImageUrl, setCroppedImageUrl] = useState();
  const [processedImageUrl, setProcessedImageUrl] = useState();
  const [ocr, setOcr] = useState();
  const [ocrStarted, setOcrStarted] = useState();
  const [ocrProgress, setOcrProgress] = useState();
  const [plantIds, setPlantIds] = useState([]);
  const [currentPlant, setCurrentPlant] = useState();
  const [price, setPrice] = useState();
  //const [position, setPosition] = useState();
  const [place, setPlace] = useState();
  const [places, setPlaces] = useState();
  const [placeSearching, setPlaceSearching] = useState();
  // const imageElem  = useRef(null);
  const fileInputElem = useRef(null);
  const ocrTextareaElem = useRef(null);

  // get a file preview before upload to remote bucket
  const reader  = new FileReader();

  // create a version of google's places service to make api calls on our behalf
  const placesService = new google.maps.places.PlacesService(document.createElement('div'))

  reader.onloadend = function () {
    // console.log("reader.onloadend reader.result:",reader.result)
    setImageUrl(reader.result)
  }

  // Caman is global object installed via a library's script tag
  const Caman = window.Caman;

  // once local image file has been read
  useEffect(() => {
    if (imageFile) {
      reader.readAsDataURL(imageFile);
    }
  },[reader, imageFile]);

  // once cropped image has been pre-processed
  useEffect(() => {
    processedImageUrl && runOCR(processedImageUrl);
  },[processedImageUrl]);

  useEffect(() => {
    ocr && handleNormalizeClick()
  },[ocr])
  // once list of matching plant id's has been updated
  useEffect(() => {
    if(plantIds.length) {
      console.log("plantIds updated:",plantIds);
      setCurrentPlant(aloePlants[plantIds[0]]);// TODO: for now use first one - later display selectable list
    }
  },[aloePlants, plantIds]);

  // once places known
  useEffect(() => {
    if (places) {
      setPlace(places[0]);
    }
  },[places]);

  const worker = createWorker({
    logger: m => m.jobId && setOcrProgress(Math.round(m.progress*100)),
  });

  // attempt to make image more readable by OCR
  const preProcessOCRImage = () => {
    //console.log("preProcessOCRImage")
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

  const runOCR = async (imageUrl) => {
    // console.log("runOCR");
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

  const handlePriceChange = evt => {
    setPrice(evt.target.value);
  }

  const handlePlaceChange = evt => {
    setPlace(evt.target.value);
  }

  const handlePlaceSelectChange = selectedOption => {
    console.log("handlePlaceSelectChange:",selectedOption)
    setPlace(selectedOption);
  }

  const handleFindLocationClick = evt => {
    console.log("handleFindLocationClick");
    setPlaceSearching(true);
    navigator.geolocation.getCurrentPosition((position) => {
      console.log("..geo position:",position.coords);
      //setPosition(position);
      // use position to find a 'place' via google maps
      placesService.findPlaceFromQuery({
        query: place,
        locationBias: { lat: position.coords.latitude, lng: position.coords.longitude },
        fields:['place_id','name','geometry','type','business_status','formatted_address'],
      }, places => {
        console.log("gmaps places result:",places);
        setPlaces(places.map(place => {
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

      // NOTE: ran into CORS issues  using straight call to  their api
      // GoogleMapsAPI.FindPlace({
      //   input_type:'textquery',
      //   input:'home depot',
      //   lat:position.coords.latitude,
      //   lng:position.coords.longitude
      // })
      // .then(response => {
      //   console.log("response:",response)
      // })
      // .catch((err) => {
      //   console.log("err:",err)
      // });
    });
  }

  // clean up text returned by OCR process
  const handleNormalizeClick = () => {
    // remove special characters e.g. ", / - ' '" etc introduced by ocr
    // trim dangling whitespace, remove lines w/1 character
    let filteredOcr = ocrTextareaElem.current.props.value
    .replace(RegexConstants.EXTRANEOUS_OCR_CHARS,'')
    .replace(RegexConstants.DANGLING_WHITESPACE,'')
    .replace(RegexConstants.SINGLE_CHAR_LINE,'');
    setOcr(filteredOcr)
  }

  // description...
  const handleSearchClick = evt => {
    // console.log("handleSearchClick")
    let candidates = [];
    const ocrText = ocr.toLowerCase();
    // look for context word 'aloe'
    // get word before and after context keyword
    let match = RegexConstants.ALOE_KEYWORDS.exec(ocrText);
    // iterate through all matches looking for named groups
    while (match != null) {
      // console.log("match.groups:",match.groups)
      if(match) {
        candidates = [...new Set(candidates.concat(Object.values(match.groups)))];
        // console.log("candidates:",candidates);
      }
      match = RegexConstants.ALOE_KEYWORDS.exec(ocr.toLowerCase());
    }
    // search for these prefix/suffix words in list of known keywords
    updatePlantIds(candidates, ocrText.split(' '));

    // look for price
    let priceMatch =  RegexConstants.PRICE.exec(ocrText);
    if(priceMatch) {
      //clean up
      const price = priceMatch[0].replace(' ','');
      // console.log("priceMatch:",priceMatch, " price:",price);
      setPrice(price)
    }

  }

  // given an array of words determine if any members are keywords and add to plantIds list.
  // optionally use a backup list for further searching
  const updatePlantIds = (list, secondaryList) => {
      // console.log("updatePlantIds list:",list);
    let result;
    let flag;
    list.forEach(key => {
        // console.log("...key:",key)
      result = keywords[key];
      if(!!result) {
        // console.log(".....",result)
        flag = true;
        setPlantIds([...new Set(plantIds.concat(result))]);
      }
    });
    if(!flag && secondaryList) {
      updatePlantIds(secondaryList);
    }
  };

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
        <canvas id="filteredImage" className="d-none"></canvas>
      </FormGroup>

      { imageFile
        && (
          <FormGroup>
            <Button color="primary" onClick={getImageText} className="mr-2" disabled={ocrStarted }>Get Text in Image!</Button>
          </FormGroup>
        )
      }

      <FormGroup className="ocr-preview w-100 my-3">
      {ocr &&
        (
          <Form onSubmit={handleFireBaseUpload}>
          <FormGroup>
            <label>
              Here's a best guess at the text in the image.<br/>
              <Input
                className="ocr-of-snapshot p-2 w-100"
                type="textarea"
                value={ocr}
                style={{minHeight:'10rem'}}
                onChange={handleOcrInputChange}
                ref={ocrTextareaElem}
              />
            </label>

            <div>
              <Button color="primary" onClick={handleSearchClick} className="mr-2">Search</Button>
            </div>

            {currentPlant
            && (
              <>
              <p>Based on the image text here's what we think it is:</p>
              <label className="d-block">
                Latin Name:
                <Input
                  className="p-2"
                  type="text"
                  value={currentPlant.latin_name}
                  disabled={true}
                />
              </label>
              <label className="d-block">
                Common Name:
                <Input
                  className="p-2"
                  type="text"
                  value={currentPlant.aka[0]}
                  disabled={true}
                />
              </label>
              <label className="d-block">
                Price
                <Input
                  className="p-2"
                  type="text"
                  value={price}
                  onChange={handlePriceChange}
                />
              </label>
              </>
            )}

            <hr />
              <FormGroup>
              <label className="w-100">
                Where did you find this plant?
                <Input
                  className="p-2"
                  type="text"

                  onChange={handlePlaceChange}
                  placeholder="Enter some or all of the store name"
                />
              </label>
              <Button
                className="d-block"
                onClick={handleFindLocationClick}
              >
                {!placeSearching && (<span>Find your location</span>)}
                {placeSearching
                  && (
                    <><Spinner size="sm" color="secondary" /> Searching...</>
                  )
                }
              </Button>
              <div id="placesContainer"></div>
              <Select
                value={place}
                onChange={handlePlaceSelectChange}
                options={places}
              />
              </FormGroup>
            <hr />

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

      <Button className="mt-3">
        <Link className="back-navigation" to={{pathname: '/', state: { prevPath: window.location.pathname }}}>
          <FontAwesomeIcon icon={faAngleLeft} /> Home
        </Link>
      </Button>

    </Container>
  );
};

export default UploadFileForm;
