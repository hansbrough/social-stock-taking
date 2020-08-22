import { createSlice } from '@reduxjs/toolkit';

export const processedImagesSlice = createSlice({
  name: 'processedImages',
  initialState: [],
  reducers: {
    upsert: (state, action) => {
      //console.log("Processed upsert")
      if(action.payload) {
        const { imageDataURL, id } = action.payload;
        //console.log("..!state.some(item => item.id === id):",!state.some(item => item.id === id))
        if(!state.length || !state.some(item => item.id === id)) {
          //console.log("...insert")
          state.push({id, imageDataURL});
        } else {
          //console.log("...update")
          // update item w/matching id or return item 'as is' if not a match.
          return state.map(obj => {
            if(obj.id === id) {
              return { ...obj, imageDataURL };
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
export const selectProcessedImageById = (state, id) => state.processedImages.find(img => img.id === id);

export const selectProcessedImages = state => state.processedImages;

export default processedImagesSlice.reducer
