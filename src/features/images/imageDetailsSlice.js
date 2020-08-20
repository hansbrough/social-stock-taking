import { createSlice } from '@reduxjs/toolkit';

export const imageDetailsSlice = createSlice({
  name: 'imageDetails',
  initialState: [],
  reducers: {
    upsert: (state, action) => {
      if(action.payload) {
        const { id, pid, latin_name:latinName, aka:commonName, price } = action.payload;
        //console.log("!upsert:",{ id, pid, latinName, commonName, price });
        if(!state.length) {
          //console.log("...insert")
          state.push({id, pid, latinName, commonName, price});
        } else {
          //console.log("...update")
          state.map(obj => {
            if(obj.id === id) {
              //console.log("......updating")
              return { ...obj, pid, latinName, commonName, price };
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

export const { upsert:saveImageDetails, reset:resetImageDetails } = imageDetailsSlice.actions;

export const selectImageDetails = state => state.imageDetails;

export default imageDetailsSlice.reducer
