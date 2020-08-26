import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

export const workflowsSlice = createSlice({
  name: 'workflows',
  initialState: [],
  reducers: {
    upsert: (state, action) => {
      if(action.payload) {
        console.log("workflowsSlice action.payload:",action.payload)
        if(!state.find((item) => item.wid === action.payload.wid )) {
          console.log("...insert")
          state.push(action.payload)
        } else {
          console.log("...update tbd - not sure when we'd need to update a completed workflow.")
        }
      }
    },
    reset: (state, action) => {
      //console.log("workflowsSlice reset")
      return [];
    }
  }
})

export const { upsert:saveWorkflows, reset:resetWorkflows } = workflowsSlice.actions;
export const selectWorkflowByIdx = (state, idx) => state.workflows[idx];

/*-- Selectors --*/
export const selectWorkflows = state => state.workflows;
const getWorkflowId = (state, props) => props && props.id;

/*-- Reselectors --*/
export const selectWorkflowById = createSelector(
  [selectWorkflows, getWorkflowId],
  (workflows, id) => workflows.find(item => item.id === id)
);

export const selectLastWorkflow = createSelector(
  [selectWorkflows],
  workflows => workflows[Math.max(0, workflows.length -1)]
);

export const selectLastWorkflowId = createSelector(
  [selectWorkflows, selectLastWorkflow],
  (workflows, lastWorkflow) => lastWorkflow && lastWorkflow.wid
);


export default workflowsSlice.reducer
