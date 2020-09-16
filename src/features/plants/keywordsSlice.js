import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import aloes from '../../utils/aloe_keywords';
import agaves from '../../utils/agave_keywords';

export const keywordsSlice = createSlice({
  name: 'keywords',
  initialState: {
    aloes,
    agaves
  },
  reducers: {}
})

// Actions
//export const { load } = keywordsSlice.actions

// Selectors
export const selectAloes = state => state.keywords.aloes;
export const selectAgaves = state => state.keywords.agaves;

// Reselectors
export const selectSucculentKeywords = createSelector(
  [selectAloes, selectAgaves],
  (aloes, agaves) => weakDeepMergeObjects(aloes, agaves)
);

// "one level" deep merge for objects with arrays as values
const weakDeepMergeObjects = (target, source) => {
  const destination = {...target};
  Object.keys(source).forEach(key => {
    if(!destination[key]){
      destination[key] = source[key];
    } else if(Array.isArray(destination[key])) {
      destination[key] = [...destination[key], ...source[key]];
    } else {
      console.log("weakDeepMergeObjects duplicate key with value other than an array.")
    }
  });
  return destination;
};

export default keywordsSlice.reducer
