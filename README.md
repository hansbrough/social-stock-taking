
## Overview

A mobile web app that enables users at their local nursery to take pictures of plant labels, crop, automatically convert the image text, determine the type of plant, the price, and where it was found. The images and their associated details are saved to a remote noSQL store. A complimentary project will provide a search interface that displays plant details on top of a map.


### Workflow Step Details

This project pulls together several pieces to create the workflow described above. The architecture is composed of React functional components using a variety of hooks. A small Redux store helps organize and persist data associated with the current workflow. Because users can navigate the image capture and data gathering workflow multiple times - all data gathered is associated with a unique workflow id.

#### Capturing images

The user's camera is accessed via `navigator.mediaDevices.getUserMedia`. Since mobile devices often have more than one camera using the config `{ facingMode: 'environment' }` makes sure we are *not* using the 'selfie' camera. A camera 'stream' is provided to a video element. The `useRef` hook provides access to the video element which is passed to a `canvas` element's `drawImage` context method. The resulting canvas drawing is exported as a base64 encoded dataUrl and saved to the redux store.

#### Cropping

The component responsible for cropping uses a specialized library for the heavy lifting - [cropperjs](https://fengyuanchen.github.io/cropperjs/). An instance of Cropperjs is initialized with a reference to an image element whose `src` is set to the image captured above. The cropperjs instance is assigned to an empty useRef Hook for convenience of access throughout the project's cropping component (not just in the useEffect hook where it's initialized). Cropperjs generates custom events through the image element e.g. `cropEnd`. Cropperjs methods are called via the reference for example `cropper.current.rotate(2)`. The cropped version of the original image is saved to a dataUrl string with the help of a canvas element and saved to the redux store.

#### Extracting Text From an Image
Text is extracted from the cropped image by an OCR library [tesseract.js](https://tesseract.projectnaptha.com/). The work is performed on the user's device which saves an api request but depending on the image quality and the resources available this process may take several seconds. To help with accuracy the image is preprocessed with the help of another library [camanjs](http://camanjs.com/) Preparing images for OCR is a complicated task (and beyond the scope of this project)! The biggest single obstacle seems to be 'text warp' which makes letters and words harder to read. Unfortunately this is especially a problem when taking a picture of a plant label on the curved surface of a pot. The results are often low quality. The project tries to ameliorate the quality issue by encouraging users to take a close up picture of the plant label, asking the user correct plant name errors in the extracted text, using a set of plant name key words and asking users to choose from a list of plant candidates when multiple matches are found.

#### Determining the Plant Name and Price

The extracted text is run through a regular expression that compiles a list of all words that appear before and after the keyword 'aloe' (the project started by focusing on that narrow set of several hundred plants). This list of *candidate words* is then used to look up plant ids in a hash. If the keyword 'aloe' doesn't exist then the app treats every word in the extracted text as a potential candidate. The resulting list of plant ids is mapped into selectable plant options from which the user is asked to choose. Once selected the plant details are saved to the store under the current workflow id.

#### Determining the Place

The users location is determined with the help of the [HTML5's Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) and [Google's PlacesService](https://developers.google.com/places/web-service/details) API. The user can choose between multiple place matches - or accept the default choice. If the user the same lat/lng position in subsequent workflows the Google Places API request is skipped and the prior location details are recycled. The selected place details are saved to the store.

#### Saving to the Cloud and Hosting
[Firebase Storage](https://firebase.google.com/products/storage) is used for saving images and [Cloud Firestore](https://firebase.google.com/products/firestore) for persisting data. The site is served with [Firebase Hosting](https://firebase.google.com/products/hosting). The work in progress is available here: [https://gardenplants-96576.web.app/](https://gardenplants-96576.web.app/) - try it on your phone... on desktop you'll end up taking selfies :)

<em>caveat</em> - the file upload flow is non-functional for the time being.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
