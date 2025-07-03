import React from 'react';
import SettingsPanel from '../components/settings/SettingsPanel';

// This is the main entry point for the Settings page.
// It simply renders the SettingsPanel, which contains all the settings cards.
// See src/components/settings/SettingsPanel.tsx for the main layout and card organization.

const Settings: React.FC = () => (
  <SettingsPanel />
);

export default Settings; 