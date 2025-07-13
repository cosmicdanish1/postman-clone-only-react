// File: RestProvider.tsx
// Type: Context Provider
// Imports: React, hooks, context
// Imported by: App.tsx or a top-level component
// Role: Provides REST-related context to the application
// Located at: src/features/RestProvider.tsx

import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import {
  useTabs,
  useActiveTab,
  useTabActions,
  useRequestActions,
  useEnvironments,
  useActiveTabHeaders,
  useActiveTabParams,
  useActiveTabResponse,
} from './restHooks';

interface RestContextType {
  // Tabs
  tabs: ReturnType<typeof useTabs>;
  activeTab: ReturnType<typeof useActiveTab>;
  tabActions: ReturnType<typeof useTabActions>;
  
  // Request
  requestActions: ReturnType<typeof useRequestActions>;
  
  // Environment
  environments: ReturnType<typeof useEnvironments>;
  
  // Derived data
  activeHeaders: ReturnType<typeof useActiveTabHeaders>;
  activeParams: ReturnType<typeof useActiveTabParams>;
  activeResponse: ReturnType<typeof useActiveTabResponse>;
}

const RestContext = createContext<RestContextType | undefined>(undefined);

export const RestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const tabs = useTabs();
  const activeTab = useActiveTab();
  const tabActions = useTabActions();
  const requestActions = useRequestActions();
  const environments = useEnvironments();
  const activeHeaders = useActiveTabHeaders();
  const activeParams = useActiveTabParams();
  const activeResponse = useActiveTabResponse();

  const value = {
    tabs,
    activeTab,
    tabActions,
    requestActions,
    environments,
    activeHeaders,
    activeParams,
    activeResponse,
  };

  return <RestContext.Provider value={value}>{children}</RestContext.Provider>;
};

export const useRest = (): RestContextType => {
  const context = useContext(RestContext);
  if (context === undefined) {
    throw new Error('useRest must be used within a RestProvider');
  }
  return context;
};
