import { configureStore } from '@reduxjs/toolkit';
import plantsReducer from '../features/plants/plantsSlice';
import originalImagesReducer from '../features/images/originalImagesSlice';
import croppedImagesReducer from '../features/images/croppedImagesSlice';
import processedImagesReducer from '../features/images/processedImagesSlice';
import imagesDetailsReducer from '../features/images/imageDetailsSlice';
import imageLocationReducer from '../features/images/imageLocationSlice';

export default configureStore({
  reducer: {
    plants: plantsReducer,
    originalImages: originalImagesReducer,
    croppedImages: croppedImagesReducer,
    processedImages: processedImagesReducer,
    imageDetails: imagesDetailsReducer,
    imageLocation: imageLocationReducer,
  }
})
