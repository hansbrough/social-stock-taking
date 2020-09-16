import { createSlice } from '@reduxjs/toolkit';
import aloes from '../../utils/aloes';
import agaves from '../../utils/agaves';

export const plantsSlice = createSlice({
  name: 'plants',
  initialState: {
    aloes,
    agaves
  },
  reducers: {}
})

// Actions
//export const { load } = plantsSlice.actions

// Selectors
export const selectAloes = state => state.plants.aloes;
export const selectAgaves = state => state.plants.agaves;

// Reselectors
export const selectSucculents = state => {return {...state.plants.aloes, ...state.plants.agaves}};

export default plantsSlice.reducer
