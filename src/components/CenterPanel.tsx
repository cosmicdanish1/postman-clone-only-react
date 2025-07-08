// File: CenterPanel.tsx
// Type: Component (UI layout panel)
// Imports: React, RequestPanel
// Imported by: Main layout or feature pages
// Role: Provides a central panel for UI layout, likely used for main content display.
// Located at: src/components/CenterPanel.tsx
import React from 'react';
import RequestPanel from '../pages/Rest/RequestPanel';
import { useSelector } from 'react-redux';

const CenterPanel: React.FC = () => {
  const theme = useSelector((state: any) => state.theme.theme);
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)
  return (
    <div className={`flex flex-col flex-1 bg-bg text-text border-r border-border ${themeClass}`}>
      <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto">
        <RequestPanel />
      </div>
    </div>
  );
};

export default CenterPanel; 