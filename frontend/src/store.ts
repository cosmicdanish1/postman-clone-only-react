// File: store.ts
// Type: Redux Store Setup
// Imports: configureStore (from @reduxjs/toolkit), reducers
// Imported by: components/Layout.tsx, other components using Redux state
// Role: Configures and exports the Redux store for global state management.
// Located at: src/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import settingsReducer from './features/settingsSlice';
import themeReducer from './features/themeSlice';
import restReducer from './features/restSlice';

declare const process: {
  env: {
    NODE_ENV: 'development' | 'production' | 'test';
  };
};

const rootReducer = combineReducers({
  settings: settingsReducer,
  theme: themeReducer,
  rest: restReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['rest/sendRequestStart'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['rest.tabs'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;