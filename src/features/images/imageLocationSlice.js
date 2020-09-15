import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

export const imageLocationSlice = createSlice({
  name: 'imageLocation',
  initialState: [],
  reducers: {
    upsert: (state, action) => {
      if(action.payload) {
        const { id, place_id:placeId, formatted_address:address, name, lat, lng} = action.payload;
        //console.log("Location upsert:",{ id, placeId, address, name, lat, lng });
        if(!state.length || !state.some(item => item.id === id)) {
          //console.log("...insert")
          state.push({id, placeId, address, name, lat, lng});
        } else {
          //console.log("...update")
          return state.map(obj => {
            if(obj.id === id) {
              //console.log("......updating match");
              return { ...obj, placeId, address, name, lat, lng };
            }
            return obj
          });
        }
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

//Actions
export const { upsert:saveImageLocation, reset:resetImageLocation, remove: removeImageLocation } = imageLocationSlice.actions;

//Selectors
export const selectImageLocations = state => state.imageLocation;
const getImageLocationId = (state, props) => props && props.id;

// reselectors
export const selectImageLocationById = createSelector(
  [selectImageLocations, getImageLocationId],
  (imageLocations, id) => imageLocations.find(item => item.id === id)
);
export const selectLastImageLocation = createSelector(
  [selectImageLocations],
  imageLocations => imageLocations[Math.max(0, imageLocations.length -1)]
);

export const selectLastImageLocationId = createSelector(
  [selectLastImageLocation],
  (lastImageLocation) => lastImageLocation && lastImageLocation.id
);


export default imageLocationSlice.reducer
