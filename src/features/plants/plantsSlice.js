import { createSlice } from '@reduxjs/toolkit';
import aloes from '../../utils/aloes';

export const plantsSlice = createSlice({
  name: 'plants',
  initialState: {
    aloes
  },
  reducers: {
    load: state => {
      state.aloes = aloes
    }
  }
})

export const { load } = plantsSlice.actions

export const selectAloes = state => state.plants.aloes;

export default plantsSlice.reducer
