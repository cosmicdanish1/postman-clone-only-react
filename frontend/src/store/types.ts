import type { TabsState } from '../features/tabsSlice';
import type { RestState } from '../features/restSlice';

type SettingsState = any; // Replace with actual type if available
type ThemeState = any;    // Replace with actual type if available

export interface RootState {
  settings: SettingsState;
  theme: ThemeState;
  tabs: TabsState;
  rest: RestState;
}

export type {
  SettingsState,
  ThemeState,
  TabsState,
  RestState,
};
