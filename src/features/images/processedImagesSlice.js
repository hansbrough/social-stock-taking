import { createSlice } from '@reduxjs/toolkit';

export const processedImagesSlice = createSlice({
  name: 'processedImages',
  initialState: [],
  reducers: {
    upsert: (state, action) => {
      if(action.payload) {
        const { imageDataURL, id } = action.payload;
        if(!state.length) {
          state.push({id, imageDataURL});
        } else {
          state.map(obj => {
            if(obj.id === id) {
              obj.imageDataURL = imageDataURL;
            }
            return obj
          });
        }
      }
    },
    reset: (state, action) => {
      return [];
    }
  }
})

export const { upsert:saveProcessedImage, reset:resetProcessedImage } = processedImagesSlice.actions;

export const selectProcessedImages = state => state.processedImages;

export default processedImagesSlice.reducer
