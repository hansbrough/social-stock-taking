import { createSlice } from '@reduxjs/toolkit';

export const croppedImagesSlice = createSlice({
  name: 'croppedImages',
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

export const { upsert:saveCroppedImage, reset:resetCroppedImage } = croppedImagesSlice.actions;

export const selectCroppedImages = state => state.croppedImages;
export const selectCroppedImageById = (state, id) => state.croppedImages.find(img => img.id === id);

export default croppedImagesSlice.reducer
