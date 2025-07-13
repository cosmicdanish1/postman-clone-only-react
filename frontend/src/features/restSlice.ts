// File: restSlice.ts
// Type: Redux Slice
// Imports: createSlice (from @reduxjs/toolkit)
// Imported by: store.ts
// Role: Manages REST client state including tabs, requests, and responses.
// Located at: src/features/restSlice.ts

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { RestState, TabData } from './restTypes';
import { initialTabState } from './restTypes';

const initialState: RestState = {
  tabs: [],
  activeTabId: null,
  isLoading: false,
  error: null,
  environments: [
    {
      id: 'default',
      name: 'No Environment',
      variables: [],
    },
  ],
  activeEnvironmentId: 'default',
};

const restSlice = createSlice({
  name: 'rest',
  initialState,
  reducers: {
    // Tab management
    addTab: (state, action: PayloadAction<Partial<TabData>>) => {
      const newTab: TabData = {
        ...initialTabState,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...action.payload,
      };
      state.tabs.push(newTab);
      state.activeTabId = newTab.id;
    },
    
    updateTab: (state, action: PayloadAction<{ id: string; changes: Partial<TabData> }>) => {
      const index = state.tabs.findIndex(tab => tab.id === action.payload.id);
      if (index !== -1) {
        state.tabs[index] = {
          ...state.tabs[index],
          ...action.payload.changes,
          updatedAt: new Date().toISOString(),
          isDirty: true,
        };
      }
    },
    
    removeTab: (state, action: PayloadAction<string>) => {
      const index = state.tabs.findIndex(tab => tab.id === action.payload);
      if (index !== -1) {
        state.tabs.splice(index, 1);
        if (state.activeTabId === action.payload) {
          state.activeTabId = state.tabs.length > 0 ? state.tabs[0].id : null;
        }
      }
    },
    
    setActiveTab: (state, action: PayloadAction<string>) => {
      if (state.tabs.some(tab => tab.id === action.payload)) {
        state.activeTabId = action.payload;
      }
    },
    
    // Request management
    sendRequestStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    
    sendRequestSuccess: (state, action: PayloadAction<{ tabId: string; response: any }>) => {
      const { tabId, response } = action.payload;
      const tab = state.tabs.find(tab => tab.id === tabId);
      if (tab) {
        tab.response = response;
        tab.updatedAt = new Date().toISOString();
      }
      state.isLoading = false;
    },
    
    sendRequestFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    // Environment management
    addEnvironment: (state, action: PayloadAction<{ name: string }>) => {
      const newEnv = {
        id: uuidv4(),
        name: action.payload.name,
        variables: [],
      };
      state.environments.push(newEnv);
    },
    
    setActiveEnvironment: (state, action: PayloadAction<string>) => {
      state.activeEnvironmentId = action.payload;
    },
  },
});

export const {
  addTab,
  updateTab,
  removeTab,
  setActiveTab,
  sendRequestStart,
  sendRequestSuccess,
  sendRequestFailure,
  addEnvironment,
  setActiveEnvironment,
} = restSlice.actions;

export default restSlice.reducer;
