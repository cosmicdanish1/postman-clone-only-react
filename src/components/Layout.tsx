// File: Layout.tsx
// Type: Layout Component
// Imports: React, Sidebar, useLocation (react-router-dom), RestSubSidebar, CollectionsSubSidebar, useSelector (redux)
// Imported by: App.tsx
// Role: Provides the main layout structure for the app, including sidebar and main content area.
// Located at: src/components/Layout.tsx
import React from 'react';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';
import RestSubSidebar from '../pages/Rest/RestSubSidebar';

// import GraphQLSubSidebar from '../pages/GraphQL/GraphQLSubSidebar';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const sidebarLeft = useSelector((state: RootState) => state.settings.sidebarLeft);
  return (
    <div className="flex h-screen bg-zinc-900 text-white font-sans">
      <Sidebar />
      {sidebarLeft && location.pathname === '/' && <RestSubSidebar />}
      {sidebarLeft && location.pathname === '/collections' && <CollectionsSubSidebar />}
      {/* {sidebarLeft && location.pathname.startsWith('/graphql') && <GraphQLSubSidebar />} */}
      <main className="flex flex-1 h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout; 