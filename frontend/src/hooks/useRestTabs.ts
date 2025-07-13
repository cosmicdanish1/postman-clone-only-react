import { useState, useCallback } from 'react';
import { uuidv4 } from '../utils/helpers';
import type { TabData, AuthType } from '../types';

/*
 * Hook that owns all tab-related state and basic handlers for the REST page.
 * Phase-1 extraction – keeps the public surface minimal but matches existing usages
 * inside RestPage.tsx so it can be wired in without large churn.
 */

const defaultTabData = (): TabData => ({
  id: uuidv4(),
  method: 'GET',
  tabName: 'Untitled',
  url: 'https://echo.hoppscotch.io',
  showModal: false,
  modalValue: 'Untitled',
  activeTab: 'parameters',
  parameters: [],
  body: '',
  headers: [
    { id: uuidv4(), key: '', value: '', description: '', locked: false },
    { id: uuidv4(), key: 'content type', value: '', description: '', locked: true },
  ],
  authorization: 'none' as const,
  preRequest: '',
  postRequest: '',
  variables: [],
  // Response-related placeholders
  responseStatus: null,
  responseStatusText: '',
  responseHeaders: [],
  responseBody: '',
  responseTime: null,
  responseSize: null,
  isLoading: false,
  responseError: null,
});

export interface UseRestTabs {
  tabs: TabData[];
  setTabs: React.Dispatch<React.SetStateAction<TabData[]>>;
  activeTabId: string;
  setActiveTabId: React.Dispatch<React.SetStateAction<string>>;
  activeTabObj: TabData;
  /* Convenience helpers – not yet wired everywhere but available */
  addTab: () => void;
  switchTab: (id: string) => void;
  setMethod: (method: string) => void;
  setActiveTab: (tab: string) => void;
  setAuthorization: (auth: AuthType) => void;
  setUrl: (url: string) => void;
}

export const useRestTabs = (): UseRestTabs => {
  const [tabs, setTabs] = useState<TabData[]>([defaultTabData()]);
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id);
  
  // Helper function to update the authorization for the active tab
  const setAuthorization = useCallback((auth: AuthType) => {
    setTabs(prevTabs => 
      prevTabs.map(tab => 
        tab.id === activeTabId ? { ...tab, authorization: auth } : tab
      )
    );
  }, [activeTabId]);

  const activeTabObj = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  /* Helpers mimicking functions already present in RestPage */
  const addTab = () => setTabs((prev) => [...prev, defaultTabData()]);

  const switchTab = (id: string) => setActiveTabId(id);

  const setMethod = (method: string) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === activeTabId ? { ...tab, method } : tab)),
    );
  };

  const setUrl = (url: string) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === activeTabId ? { ...tab, url } : tab)),
    );
  };

  const setActiveTab = (tab: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, activeTab: tab } : t)),
    );
  };

  return {
    tabs,
    setTabs,
    activeTabId,
    setActiveTabId,
    activeTabObj,
    addTab,
    switchTab,
    setMethod,
    setActiveTab,
    setUrl,
    setAuthorization,
  } as const;
};
