import { createSlice } from '@reduxjs/toolkit';

export const currentWorkflowSlice = createSlice({
  name: 'currentWorkflow',
  initialState: {completed:{}},
  reducers: {
    upsert: (state, action) => {
      if(action.payload) {
        //console.log("workflowSlice action.payload:",action.payload)
        const { wid, completed } = action.payload;
        if(!state.wid) {
          state.wid = wid
        } else {
          return Object.keys(completed).forEach(key => state.completed[key] = completed[key]);
        }
      }
    },
    reset: (state, action) => {
      return {completed:{}};
    }
  }
})

export const { upsert:saveCurrentWorkflow, reset:resetCurrentWorkflow } = currentWorkflowSlice.actions;

export const selectCurrentWorkflow = state => state.currentWorkflow;

export default currentWorkflowSlice.reducer
