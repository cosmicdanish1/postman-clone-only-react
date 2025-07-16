import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import settingsReducer from '../features/settingsSlice';
import themeReducer from '../features/themeSlice';
import tabsReducer from '../features/tabsSlice';
import restReducer from '../features/restSlice';
import type { RootState } from './types';

// Create the store with the root reducer
const store = configureStore({
  reducer: {
    settings: settingsReducer,
    theme: themeReducer,
    tabs: tabsReducer,
    rest: restReducer,
  },
});

// Infer the AppDispatch type from the store itself
type AppDispatch = typeof store.dispatch;

// Create typed versions of the hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Export the store
export { store };

export type { AppDispatch, RootState };
