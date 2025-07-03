import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './features/settingsSlice';

// Import reducers here (will add settings slice soon)

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 