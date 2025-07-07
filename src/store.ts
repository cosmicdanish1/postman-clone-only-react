// File: store.ts
// Type: Redux Store Setup
// Imports: configureStore (from @reduxjs/toolkit), settingsSlice
// Imported by: components/Layout.tsx, other components using Redux state
// Role: Configures and exports the Redux store for global state management.
// Located at: src/store.ts
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