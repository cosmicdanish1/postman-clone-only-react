import { createSlice } from '@reduxjs/toolkit';
import type { TabData } from '../features/restTypes';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface TabsState {
  tabs: TabData[];
  activeTabId: string | null;
  environments: Array<{
    id: string;
    name: string;
    variables: Array<{ key: string; value: string }>;
  }>;
  activeEnvironmentId: string | null;
}

const initialState: TabsState = {
  tabs: [{
    id: 'tab-1',
    name: 'Untitled',
    method: 'GET',
    url: 'https://echo.hoppscotch.io',
    headers: [],
    parameters: [],
    body: {
      raw: '',
      formData: [],
      urlEncoded: [],
      binary: '',
      graphQL: {
        query: '',
        variables: '{}'
      }
    },
    auth: { type: 'none' },
    isSaving: false,
    isDirty: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }],
  activeTabId: 'tab-1',
  environments: [
    {
      id: 'default',
      name: 'No Environment',
      variables: [],
    }
  ],
  activeEnvironmentId: 'default'
};

const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    addTab: (state: TabsState, action: PayloadAction<TabData>) => {
      state.tabs.push(action.payload);
      state.activeTabId = action.payload.id;
    },
    switchTab: (state: TabsState, action: PayloadAction<string>) => {
      state.activeTabId = action.payload;
    },
    updateTab: (state: TabsState, action: PayloadAction<{ id: string; data: Partial<TabData> }>) => {
      const tab = state.tabs.find(t => t.id === action.payload.id);
      if (tab) {
        Object.assign(tab, action.payload.data);
      }
    },
    removeTab: (state: TabsState, action: PayloadAction<string>) => {
      state.tabs = state.tabs.filter(tab => tab.id !== action.payload);
      if (state.activeTabId === action.payload) {
        state.activeTabId = state.tabs.length > 0 ? state.tabs[0].id : null;
      }
    },
    addEnvironment: (state: TabsState, action: PayloadAction<{
      id: string;
      name: string;
      variables: Array<{ key: string; value: string }>
    }>) => {
      state.environments.push(action.payload);
    },
    setActiveEnvironment: (state: TabsState, action: PayloadAction<string>) => {
      state.activeEnvironmentId = action.payload;
    }
  },
});

export const { 
  addTab, 
  switchTab, 
  updateTab, 
  removeTab, 
  addEnvironment, 
  setActiveEnvironment 
} = tabsSlice.actions;

export default tabsSlice.reducer;

// TabsState is already exported via the interface
