import { createSlice } from '@reduxjs/toolkit';

export const croppedImagesSlice = createSlice({
  name: 'croppedImages',
  initialState: [],
  reducers: {
    save: (state, action) => {
      if(action.payload) {
        const { imageDataURL, id } = action.payload;
        state.push({id, imageDataURL});
      }
    },
    reset: (state, action) => {
      return [];
    }
  }
})

export const { save:saveCroppedImage, reset:resetCroppedImage } = croppedImagesSlice.actions;

export const selectCroppedImages = state => state.croppedImages;

export default croppedImagesSlice.reducer
