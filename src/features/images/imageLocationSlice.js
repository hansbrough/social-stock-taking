import { createSlice } from '@reduxjs/toolkit';

export const imageLocationSlice = createSlice({
  name: 'imageLocation',
  initialState: [],
  reducers: {
    upsert: (state, action) => {
      if(action.payload) {
        const { id, place_id:placeId, formatted_address:address, name, lat, lng} = action.payload;
        console.log("!upsert:",{ id, placeId, address, name, lat, lng });
        if(!state.length) {
          //console.log("...insert")
          state.push({id, placeId, address, name, lat, lng});
        } else {
          //console.log("...update")
          return state.map(obj => {
            if(obj.id === id) {
              //console.log("......updating");
              return { ...obj, placeId, address, name, lat, lng };
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

export const { upsert:saveImageLocation, reset:resetImageLocation } = imageLocationSlice.actions;

export const selectImageLocation = state => state.imageLocation;

export default imageLocationSlice.reducer