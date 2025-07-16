import type { TabData } from '../../types/tab';

export interface TabState {
  tabs: TabData[];
  activeTabId: string;
}
