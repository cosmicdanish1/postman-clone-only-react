// File: Layout.tsx
// Type: Layout Component
// Imports: React, Sidebar, useLocation (react-router-dom), RestSubSidebar, CollectionsSubSidebar, useSelector (redux)
// Imported by: App.tsx
// Role: Provides the main layout structure for the app, including sidebar and main content area.
// Located at: src/components/Layout.tsx
import React from 'react';
import Sidebar from './Sidebar';
// import GraphQLSubSidebar from '../pages/GraphQL/GraphQLSubSidebar';
import { useSelector } from 'react-redux';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useSelector((state: any) => state.theme.theme);
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)
  return (
    <div className={`flex h-screen bg-bg text-text font-sans ${themeClass}`}>
      <Sidebar />
      {/* Remove RestSubSidebar from the left side */}
      {/* {sidebarLeft && location.pathname === '/' && <RestSubSidebar />} */}
      {/* {sidebarLeft && location.pathname.startsWith('/graphql') && <GraphQLSubSidebar />} */}
      <main className="flex flex-1 h-screen">
        {children}
      </main>
     
    </div>
  );
}; 

export default Layout; 