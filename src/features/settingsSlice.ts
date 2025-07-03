import { createSlice } from '@reduxjs/toolkit';

interface SettingsState {
  telemetry: boolean;
  expandNav: boolean;
  sidebarLeft: boolean;
  allExperiments: boolean;
}

const initialState: SettingsState = {
  telemetry: false,
  expandNav: false,
  sidebarLeft: false,
  allExperiments: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTelemetry(state, action) {
      state.telemetry = action.payload;
    },
    setExpandNav(state, action) {
      state.expandNav = action.payload;
    },
    setSidebarLeft(state, action) {
      state.sidebarLeft = action.payload;
    },
    setAllExperiments(state, action) {
      state.allExperiments = action.payload;
    },
    toggleTelemetry(state) {
      state.telemetry = !state.telemetry;
    },
    toggleExpandNav(state) {
      state.expandNav = !state.expandNav;
    },
    toggleSidebarLeft(state) {
      state.sidebarLeft = !state.sidebarLeft;
    },
    toggleAllExperiments(state) {
      state.allExperiments = !state.allExperiments;
    },
  },
});

export const {
  setTelemetry,
  setExpandNav,
  setSidebarLeft,
  setAllExperiments,
  toggleTelemetry,
  toggleExpandNav,
  toggleSidebarLeft,
  toggleAllExperiments,
} = settingsSlice.actions;

export default settingsSlice.reducer; 