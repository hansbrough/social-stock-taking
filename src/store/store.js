import { configureStore } from '@reduxjs/toolkit'
import plantsReducer from '../features/plants/plantsSlice'

export default configureStore({
  reducer: {
    plants: plantsReducer
  }
})
