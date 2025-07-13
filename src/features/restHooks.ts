// File: restHooks.ts
// Type: Custom Hooks
// Imports: Redux hooks, selectors
// Imported by: Components that need to interact with REST state
// Role: Provides custom hooks for accessing and modifying REST state
// Located at: src/features/restHooks.ts

import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import {
  addTab as addTabAction,
  updateTab,
  removeTab,
  setActiveTab,
  addEnvironment,
  setActiveEnvironment,
} from './restSlice';
import type { TabData, RequestHeader, RequestParameter } from './restTypes';
import { useApiRequest } from './useApiRequest';

// Typed versions of Redux hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
const selectRestState = (state: RootState) => state.rest;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Memoized selectors
const selectTabs = createSelector(
  [selectRestState],
  (rest: ReturnType<typeof selectRestState>) => rest.tabs
);

const selectActiveTabId = createSelector(
  [selectRestState],
  (rest: ReturnType<typeof selectRestState>) => rest.activeTabId
);

const selectActiveTab = createSelector(
  [selectTabs, selectActiveTabId],
  (tabs: TabData[], activeTabId: string | null) => 
    tabs.find((tab: TabData) => tab.id === activeTabId)
);

// Tab management hooks
export const useTabs = () => {
  return useAppSelector(selectTabs);
};

export const useActiveTab = (): TabData | null => {
  const tab = useAppSelector(selectActiveTab);
  console.log('Active tab:', tab); // Debug log
  return tab || null;
};

export const useTabActions = () => {
  const dispatch = useAppDispatch();

  return {
    addTab: (tabData: Partial<TabData> = {}) => dispatch(addTabAction(tabData)),
    updateTab: (id: string, changes: Partial<TabData>) =>
      dispatch(updateTab({ id, changes })),
    removeTab: (id: string) => dispatch(removeTab(id)),
    setActiveTab: (id: string) => dispatch(setActiveTab(id)),
  };
};

// Request management hooks
export const useRequestActions = () => {
  const dispatch = useAppDispatch();
  const activeTab = useActiveTab();
  const { makeRequest } = useApiRequest();

  return {
    updateUrl: (url: string) => {
      if (activeTab) {
        dispatch(updateTab({ id: activeTab.id, changes: { url } }));
      }
    },
    updateMethod: (method: string) => {
      if (activeTab) {
        dispatch(updateTab({ id: activeTab.id, changes: { method } }));
      }
    },
    updateHeaders: (headers: RequestHeader[]) => {
      if (activeTab) {
        dispatch(updateTab({ id: activeTab.id, changes: { headers } }));
      }
    },
    updateParams: (parameters: RequestParameter[]) => {
      if (activeTab) {
        dispatch(updateTab({ id: activeTab.id, changes: { parameters } }));
      }
    },
    sendRequest: async () => {
      if (!activeTab) return;
      
      try {
        await makeRequest(activeTab);
      } catch (error) {
        // Error is already handled in makeRequest
        console.error('Request failed:', error);
      }
    },
  };
};

// Environment management hooks
interface Environment {
  id: string;
  name: string;
  variables: Array<{ key: string; value: string }>;
}

const selectEnvironments = createSelector(
  [selectRestState],
  (rest: ReturnType<typeof selectRestState>) => rest.environments
);

const selectActiveEnvironmentId = createSelector(
  [selectRestState],
  (rest: ReturnType<typeof selectRestState>) => rest.activeEnvironmentId
);

const selectActiveEnvironment = createSelector(
  [selectEnvironments, selectActiveEnvironmentId],
  (environments: Environment[], activeEnvironmentId: string | null) => 
    environments.find((env: Environment) => env.id === activeEnvironmentId)
);

export const useEnvironments = () => {
  const environments = useAppSelector(selectEnvironments);
  const activeEnvironmentId = useAppSelector(selectActiveEnvironmentId);
  const activeEnvironment = useAppSelector(selectActiveEnvironment);
  
  const dispatch = useAppDispatch();
  
  return {
    environments,
    activeEnvironment,
    activeEnvironmentId,
    addEnvironment: (name: string) => dispatch(addEnvironment({ name })),
    setActiveEnvironment: (id: string) => dispatch(setActiveEnvironment(id)),
  };
};

// Selectors for derived data
export const useActiveTabHeaders = () => {
  const activeTab = useActiveTab();
  return activeTab?.headers || [];
};

export const useActiveTabParams = () => {
  const activeTab = useActiveTab();
  return activeTab?.parameters || [];
};

export const useActiveTabResponse = () => {
  const activeTab = useActiveTab();
  return activeTab?.response;
};
