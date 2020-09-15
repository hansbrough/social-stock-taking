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
        //console.log("Details upsert:",{ id, pid, latinName, commonName, price, origImgUrl, croppedImgUrl });
        //make new object w/out undefined values
        const updatesObj = Object.entries({ id, pid, latinName, commonName, price, origImgUrl, croppedImgUrl }).reduce((a,[k,v]) => (v === undefined ? a : (a[k]=v, a)), {})
        //console.log(".....updatesObj:",updatesObj)
        if(!state.length || !state.some(item => item.id === id)) {
          //console.log("...insert")
          state.push(updatesObj);
        } else {
          //console.log("...update")
          return state.map(obj => {
            if(obj.id === id) {
              //console.log("......updating match")
              return { ...obj, ...updatesObj};
            }
            return obj
          });
        }
      }
    },
    remove: (state, action) => {
      console.log("imageDetailsSlice remove action:",action);
      return state.filter(item => item.id !== action.payload.wid);
    },
    reset: (state, action) => {
      return [];
    }
  }
})

export const { upsert:saveImageDetails, reset:resetImageDetails, remove:removeImageDetails } = imageDetailsSlice.actions;

export const selectImageDetails = state => state.imageDetails;
export const selectImageDetailsById = (state, id) => state.imageDetails.find(img => img.id === id);

export default imageDetailsSlice.reducer
