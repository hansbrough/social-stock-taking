import { configureStore } from '@reduxjs/toolkit';
import plantsReducer from '../features/plants/plantsSlice';
import originalImagesReducer from '../features/images/originalImagesSlice';
import croppedImagesReducer from '../features/images/croppedImagesSlice';

export default configureStore({
  reducer: {
    plants: plantsReducer,
    originalImages: originalImagesReducer,
    croppedImages: croppedImagesReducer,
  }
})
