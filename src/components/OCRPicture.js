import React, {useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createWorker } from 'tesseract.js';
import { Container, Button, ButtonGroup, Progress, Input, FormGroup } from 'reactstrap';
import Select from 'react-select';
//= ==== Store ===== //
import { selectCurrentWorkflow, saveCurrentWorkflow } from '../features/currentWorkflowSlice';
import { selectAloes } from '../features/plants/plantsSlice';
import { selectCroppedImageById } from '../features/images/croppedImagesSlice';
import { selectProcessedImageById, saveProcessedImage } from '../features/images/processedImagesSlice';
import { selectImageDetailsById, saveImageDetails } from '../features/images/imageDetailsSlice';
//= ==== Constants ===== //
import RegexConstants from '../constants/RegexConstants';
import ErrorKeyConstants from '../constants/ErrorKeyConstants';
//= ==== Utils ===== //

import keywords from '../utils/aloe_keywords';
import {capitalize} from '../utils/CommonUtils';
import {getErrorText} from '../utils/ErrorDisplayUtil';
//= ==== Style ===== //
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faSearch, faCog } from '@fortawesome/free-solid-svg-icons';
import '../styles/main.css';

const OCRPicture = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentWorkflow = useSelector(selectCurrentWorkflow);
  const aloePlants = useSelector(selectAloes);
  const croppedImage = useSelector((state) => selectCroppedImageById(state, currentWorkflow.wid));
  const processedImage = useSelector((state) => selectProcessedImageById(state, currentWorkflow.wid));
  const imageDetails = useSelector((state) => selectImageDetailsById(state, currentWorkflow.wid));

  const [ocr, setOcr] = useState();
  const [ocrStarted, setOcrStarted] = useState();
  const [ocrProgress, setOcrProgress] = useState();
  const [currentPlant, setCurrentPlant] = useState();
  const [plantIds, setPlantIds] = useState([]);
  const [plantOptions, setPlantOptions] = useState();// made for react-select
  const [currentPlantOption, setCurrentPlantOption] = useState();// made for react-select
  const [price, setPrice] = useState();
  const [errorKey, setErrorKey] = useState();
  const [okToDisplayFormFeedback, setOkToDisplayFormFeedback] = useState();

  const canvasElem      = useRef(null);
  const ocrTextareaElem = useRef(null);

  // Caman is global object installed via a library's script tag
  const Caman = window.Caman;

  // do something once cropped image first available
  useEffect(() => {
    !!croppedImage && preProcessOCRImage();;
  },[croppedImage]);

  // do something once cropped image has been pre-processed
  useEffect(() => {
    !!processedImage && runOCR(processedImage.imageDataURL);
  },[processedImage]);

  // once list of matching plant id's has been updated
  useEffect(() => {
    if(plantIds.length) {
      //console.log("plantIds updated:",plantIds);
      const firstPlant = {...aloePlants[plantIds[0]]};
      firstPlant.aka = firstPlant.aka.join(', ');
      setPlantOptions(plantIds.map(id => {
        const latinLabel = aloePlants[id].latin_name ? `${capitalize(aloePlants[id].latin_name)},` : '';
        const commonName = aloePlants[id].aka.length ? `${aloePlants[id].aka.join(', ')}` : '';
        return {value: id, label: `${latinLabel} ${commonName}`}
      }));
      setCurrentPlant(firstPlant);
      setErrorKey();
    } else {
      console.log("useEffect no matching plantIds found");
      setErrorKey(ErrorKeyConstants.NO_CANDIDATES);
    }
  },[aloePlants, plantIds]);

  // if imageDetails (from store) updated
  useEffect(() => {
    if(!!imageDetails) {
      //console.log("imageDetails updated:",imageDetails);
      const {latinName:latin_name, commonName:aka, price} = imageDetails;
      setCurrentPlant({latin_name,aka});
      setPrice(price);
    }
  },[imageDetails]);

  // do something once plant options are known
  useEffect(() => {
    console.log("plantOptions updated:",plantOptions)
    !!plantOptions && setCurrentPlantOption(plantOptions[0]);
  },[plantOptions]);

  // attempt to make image more readable by OCR
  const preProcessOCRImage = () => {
    console.log("preProcessOCRImage")
    Caman('#filteredImage', croppedImage.imageDataURL, function() {
          this.greyscale();
          this.sharpen(100);
          //this.threshold(80);
          //this.contrast(60)
          //this.stackBlur(1);
          this.render(function(){
            dispatch(saveProcessedImage({ id: currentWorkflow.wid, imageDataURL: this.toBase64() }));
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

  // const getImageText = evt => {
  //   preProcessOCRImage();
  // }

  // given an array of words determine if any members are keywords and replace  plantIds list.
  // optionally use a backup list for further searching
  const updatePlantIds = (list, secondaryList) => {
    // console.log("updatePlantIds candidate words list:",list);
    let result;
    let flag;
    const plantIdsList = [];
    list.forEach(key => {
      // console.log("...key:",key)
      result = keywords[key];
      if(!!result) {
        // console.log(".....",result)
        flag = true;
        setPlantIds([...new Set(plantIdsList.concat(result))]);
      }
    });
    if(!flag && secondaryList) {
      updatePlantIds(secondaryList);
    }
  };

  const handlePriceChange = evt => {
    setPrice(evt.target.value);
  }

  const handleOcrInputChange = evt => {
    setOcr(evt.target.value);
  }

  // find ocr words that maybe plant names or prices
  const handleFindMatchingClick = evt => {
    //console.log("handleFindMatchingClick")
    setOkToDisplayFormFeedback(true);
    setPlantIds([]);// clear previous searches
    let candidates = [];
    const ocrText = ocr.toLowerCase();
    // look for context word 'aloe'
    // get word before and after context keyword
    let match = RegexConstants.ALOE_KEYWORDS.exec(ocrText);
    // iterate through all matches looking for named groups
    while (match != null) {
      //console.log("...match.groups:",match.groups)
      if(match) {
        candidates = [...new Set(candidates.concat(Object.values(match.groups)))];
        console.log("...candidates:",candidates);
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
      //console.log("...priceMatch:",priceMatch, " price:",price);
      setPrice(price)
    }
  }

  // persist plant details when user verifies they are correct.
  const handleSavePlantClick = () => {
    //console.log("handleSavePlantClick currentPlant:",currentPlant);
    dispatch(saveImageDetails({ id:currentWorkflow.wid, price, ...currentPlant}));
    dispatch(saveCurrentWorkflow({ completed: { ocrPicture: true }}));
    history.push({pathname: '/setPlace'});
  }

  const handlePlantSelectChange = selectedOption => {
    //console.log("handlePlantSelectChange:",selectedOption);
    setCurrentPlantOption(selectedOption);
    setCurrentPlant(aloePlants[selectedOption.value]);
  }

  return (
    <Container className="ocr-picture-screen">
      <h1>Get Picture Text</h1>
      <p>Let's determine the plant details.</p>
      <div className="original-picture">
        <canvas ref={canvasElem} style={{display: 'none'}}></canvas>
        <div className="preview">
          {!!croppedImage && <img className="preview-img" alt="" src={croppedImage.imageDataURL} />}
          <canvas id="filteredImage" className="d-none"></canvas>
        </div>
      </div>

      <section className="ocr-preview mt-3 w-100">
      {ocr &&
        (
          <>
            <label className="w-100">
              <b>Here's a guess at text in the image.</b><br/>
              Help by fixing typos in the plant's name and price.<br/>
              <input
                className="ocr-of-snapshot p-2 mt-2 w-100"
                type="textarea"
                value={ocr}
                style={{minHeight:'10rem'}}
                onChange={handleOcrInputChange}
                ref={ocrTextareaElem}
              />
            </label>
          </>
        )
      }
      {ocrStarted && !ocrProgress &&
        (
          <span className="d-block"><FontAwesomeIcon icon={faCog} className="fa-spin" /> Preparing image for processing...</span>
        )
      }
      {ocrStarted && !!ocrProgress &&
        (
          <Progress max="100" value={ocrProgress}>{ocrProgress && `${ocrProgress}%`}</Progress>
        )
      }
      {ocr &&
        (
        <div>
          <Button color="primary" onClick={handleFindMatchingClick} className="mr-2">
            <FontAwesomeIcon icon={faSearch} /> Find a Matching Plant
          </Button>
        </div>
      )}
      {ocr && errorKey && okToDisplayFormFeedback &&
        (<p className="mt-1 mb-0 text-danger">{getErrorText(errorKey)}</p>)
      }
      {currentPlantOption &&
        (
        <>
          {plantOptions &&
            (
              <FormGroup className="mt-2">
                <span className="d-inline-block mb-2"><b>Found something!</b> Select the matching plant</span>
                <Select
                  value={currentPlantOption}
                  onChange={handlePlantSelectChange}
                  options={plantOptions}
                />
              </FormGroup>
            )
          }
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
      </section>
      <ButtonGroup className="my-3 w-100">
        <Button onClick={() => history.goBack()}
        >
          <FontAwesomeIcon icon={faAngleLeft} /> Back
        </Button>
        <Button color="primary" disabled={!plantIds.length} onClick={handleSavePlantClick}>
          That's My Plant! Next <FontAwesomeIcon icon={faAngleRight} />
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default OCRPicture;
