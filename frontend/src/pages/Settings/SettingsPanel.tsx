// File: SettingsPanel.tsx
// Type: Component (main settings panel)
// Imports: React, GeneralSettings, InterceptorSettings, ThemeSettings
// Imported by: Settings.tsx
// Role: Renders the main settings panel and tabs for the Settings feature.
// Located at: src/pages/Settings/SettingsPanel.tsx
import React from 'react';
import GeneralSettings from './GeneralSettings';
import ThemeSettings from './ThemeSettings';
import InterceptorSettings from './InterceptorSettings';
import useThemeClass from '../../hooks/useThemeClass';

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
  const { themeClass } = useThemeClass();
  return (
    <div className={`flex-1 overflow-y-auto p-1 pr-2 sm:pr-8 bg-bg text-text scrollbar-hide ${themeClass}`}>
      {/* General Card */} 
      <div className="flex flex-col sm:flex-row bg-bg text-text shadow-md">
        <div className="px-2 py-4 sm:pl-0 sm:pr-8 sm:py-8 flex flex-col items-start justify-start w-full sm:min-w-[220px] sm:max-w-xs">
          <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 pl-1 sm:pl-2 text-text">{sections[0].title}</h2>
          <p className="mb-3 sm:mb-6 text-xs sm:text-base text-text/70 pl-1 sm:pl-2">{sections[0].description}</p>
        </div>
        <div className="flex-1 p-2 sm:p-8 flex flex-col items-center justify-center">
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
      <div className="flex flex-col sm:flex-row bg-bg text-text shadow-md">
        <div className="px-2 py-4 sm:pl-0 sm:pr-8 sm:py-8 flex flex-col items-start justify-start w-full sm:min-w-[220px] sm:max-w-xs">
          <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 pl-1 sm:pl-2 text-text">{sections[1].title}</h2>
          <p className="mb-3 sm:mb-6 text-xs sm:text-base text-text/70 pl-1 sm:pl-2">{sections[1].description}</p>
        </div>
        <div className="flex-1 p-2 sm:p-8 flex flex-col items-center justify-center">
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
      <div className="flex flex-col sm:flex-row bg-bg text-text shadow-md">
        <div className="px-2 py-4 sm:pl-0 sm:pr-8 sm:py-8 flex flex-col items-start justify-start w-full sm:min-w-[220px] sm:max-w-xs">
          <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 pl-1 sm:pl-2 text-text">{sections[2].title}</h2>
          <p className="mb-3 sm:mb-6 text-xs sm:text-base text-text/70 pl-1 sm:pl-2">{sections[2].description}</p>
        </div>
        <div className="flex-1 p-2 sm:p-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-xl mx-auto">
            {sections[2].content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel; 