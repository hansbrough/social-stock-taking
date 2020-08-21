import { createSlice } from '@reduxjs/toolkit';

export const originalImagesSlice = createSlice({
  name: 'originalImages',
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

export const { save, reset } = originalImagesSlice.actions;

export const selectOriginalImages = state => state.originalImages;

export default originalImagesSlice.reducer