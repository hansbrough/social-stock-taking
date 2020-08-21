import { createSlice } from '@reduxjs/toolkit';

export const imageDetailsSlice = createSlice({
  name: 'imageDetails',
  initialState: [],
  reducers: {
    upsert: (state, action) => {
      if(action.payload) {
        const {
          id,
          pid,
          latin_name:latinName,
          aka:commonName,
          price,
          origImgUrl,
          croppedImgUrl
        } = action.payload;
        //console.log("!upsert:",{ id, pid, latinName, commonName, price, origImgUrl, croppedImgUrl });
        //make new object w/out undefined values
        const updatesObj = Object.entries({ id, pid, latinName, commonName, price, origImgUrl, croppedImgUrl }).reduce((a,[k,v]) => (v === undefined ? a : (a[k]=v, a)), {})
        //console.log(".....updatesObj:",updatesObj)
        if(!state.length) {
          //console.log("...insert")
          state.push(updatesObj);
        } else {
          //console.log("...update")
          return state.map(obj => {
            if(obj.id === id) {
              //console.log("......updating")
              return { ...obj, ...updatesObj};
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
export const selectImageDetailsById = (state, id) => state.imageDetails.find(img => img.id === id);

export default imageDetailsSlice.reducer
