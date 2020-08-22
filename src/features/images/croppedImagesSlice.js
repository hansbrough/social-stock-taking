import { createSlice } from '@reduxjs/toolkit';

export const croppedImagesSlice = createSlice({
  name: 'croppedImages',
  initialState: [],
  reducers: {
    upsert: (state, action) => {
      //console.log("Crop upsert")
      if(action.payload) {
        const { imageDataURL, id } = action.payload;
        if(!state.length || !state.some(item => item.id === id)) {
          //console.log("...insert")
          state.push({id, imageDataURL});
        } else {
          //console.log("...update")
          // update item w/matching id or return item 'as is' if not a match.
          return state.map(obj => {
            if(obj.id === id) {
              //console.log("...found matching entry")
              return { ...obj, imageDataURL };
            }
            return obj;
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
