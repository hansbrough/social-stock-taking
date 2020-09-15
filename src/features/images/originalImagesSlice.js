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
    remove: (state, action) => {
      return state.filter(item => item.id !== action.payload.wid);
    },
    reset: (state, action) => {
      return [];
    }
  }
})

export const { save, reset, remove } = originalImagesSlice.actions;

export const selectOriginalImages = state => state.originalImages;
export const selectOriginalImageById = (state, id) => state.originalImages.find(img => img.id === id);

export default originalImagesSlice.reducer
