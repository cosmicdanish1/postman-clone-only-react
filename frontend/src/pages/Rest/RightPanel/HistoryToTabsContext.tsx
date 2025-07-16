import React, { createContext, useContext } from 'react';

export interface OpenTabFromHistory {
  (opts: { url: string; method: string }): void;
}

const HistoryToTabsContext = createContext<OpenTabFromHistory | null>(null);

export const useHistoryToTabs = () => useContext(HistoryToTabsContext);

export default HistoryToTabsContext;
