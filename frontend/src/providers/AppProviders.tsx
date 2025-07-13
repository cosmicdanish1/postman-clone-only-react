// File: AppProviders.tsx
// Type: Provider Component
// Imports: React, Redux Provider, RestProvider
// Imported by: main.tsx or App.tsx
// Role: Wraps the application with all necessary providers
// Located at: src/providers/AppProviders.tsx

import React from 'react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { RestProvider } from '../features/RestProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <RestProvider>
        {children}
      </RestProvider>
    </Provider>
  );
};
