// File: CenterPanel.tsx
// Type: Component (UI layout panel)
// Imports: React, RequestPanel
// Imported by: Main layout or feature pages
// Role: Provides a central panel for UI layout, likely used for main content display.
// Located at: src/components/CenterPanel.tsx
import React from 'react';
import RequestPanel from '../pages/Rest/RequestPanel';

const CenterPanel: React.FC = () => (
  <div className="flex flex-col flex-1 bg-zinc-900 border-r border-zinc-800">
    <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto">
      <RequestPanel />
    </div>
  </div>
);

export default CenterPanel; 