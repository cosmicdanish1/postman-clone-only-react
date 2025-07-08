// File: SettingsPanel.tsx
// Type: Component (main settings panel)
// Imports: React, GeneralSettings, InterceptorSettings, ThemeSettings
// Imported by: Settings.tsx
// Role: Renders the main settings panel and tabs for the Settings feature.
// Located at: src/pages/Settings/SettingsPanel.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import GeneralSettings from './GeneralSettings';
import ThemeSettings from './ThemeSettings';
import InterceptorSettings from './InterceptorSettings';

// SettingsPanel is the main layout for the settings page.
// It organizes and renders the three main settings cards:
// - GeneralSettings (General card)
// - ThemeSettings (Theme card)
// - InterceptorSettings (Interceptor card)
// Each card is displayed with a title, description, and its respective component.

const sections = [
  {
    key: 'general',
    title: 'General',
    description: 'General settings used in the application',
    content: <GeneralSettings />,
  },
  {
    key: 'theme',
    title: 'Theme',
    description: 'Theme settings for the application',
    content: <ThemeSettings />,
  },
  {
    key: 'interceptor',
    title: 'Interceptor',
    description: 'Interceptor settings for the application',
    content: <InterceptorSettings />,
  },
];

const SettingsPanel: React.FC = () => {
  const theme = useSelector((state: any) => state.theme.theme);
  return (
    <div className={`flex-1 overflow-y-auto p-1 bg-bg text-text scrollbar-hide theme-${theme}`}>
      {/* General Card */} 
      <div className="flex flex-row bg-bg text-text shadow-md">
        <div className="pl-0 pr-8 py-8 flex flex-col items-start justify-start min-w-[220px] max-w-xs">
          <h2 className="text-2xl font-bold mb-2 pl-2 text-text">{sections[0].title}</h2>
          <p className="mb-6 text-text/70 pl-2">{sections[0].description}</p>
        </div>
        <div className="flex-1 p-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-xl mx-auto">
            {sections[0].content}
          </div>
        </div>
      </div>
      {/* Divider between General and Theme */}
      <div className="w-full flex justify-center">
        <div className="h-px w-full opacity-45 border-border rounded" />
      </div>
      {/* Theme Card */} 
      <div className="flex flex-row bg-bg text-text shadow-md">
        <div className="pl-0 pr-8 py-8 flex flex-col items-start justify-start min-w-[220px] max-w-xs">
          <h2 className="text-2xl font-bold mb-2 pl-2 text-text">{sections[1].title}</h2>
          <p className="mb-6 text-text/70 pl-2">{sections[1].description}</p>
        </div>
        <div className="flex-1 p-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-xl mx-auto">
            {sections[1].content}
          </div>
        </div>
      </div>
      {/* Divider between Theme and Interceptor */}
      <div className="w-full flex justify-center">
        <div className="h-px w-full opacity-40 border-border rounded" />
      </div>
      {/* Interceptor Card */} 
      <div className="flex flex-row bg-bg text-text shadow-md">
        <div className="pl-0 pr-8 py-8 flex flex-col items-start justify-start min-w-[220px] max-w-xs">
          <h2 className="text-2xl font-bold mb-2 pl-2 text-text">{sections[2].title}</h2>
          <p className="mb-6 text-text/70 pl-2">{sections[2].description}</p>
        </div>
        <div className="flex-1 p-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-xl mx-auto">
            {sections[2].content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel; 