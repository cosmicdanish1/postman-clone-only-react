// File: restTypes.ts
// Type: Type Definitions
// Imports: None
// Imported by: restSlice.ts, components using REST state
// Role: Contains TypeScript interfaces and types for the REST feature
// Located at: src/features/restTypes.ts

export interface RequestHeader {
  id: string;
  key: string;
  value: string;
  description: string;
  enabled: boolean;
}

export interface RequestParameter {
  id: string;
  key: string;
  value: string;
  description: string;
  enabled: boolean;
}

export interface RequestBody {
  raw: string;
  formData: Array<{ id: string; key: string; value: string; type: string; enabled: boolean }>;
  urlEncoded: Array<{ id: string; key: string; value: string; description: string; enabled: boolean }>;
  binary: string;
  graphQL: {
    query: string;
    variables: string;
  };
}

export interface RequestAuth {
  type: 'none' | 'basic' | 'bearer' | 'apiKey' | 'oauth2';
  basic?: {
    username: string;
    password: string;
  };
  bearer?: {
    token: string;
  };
  apiKey?: {
    key: string;
    value: string;
    addTo: 'header' | 'query';
  };
}

export interface TabData {
  id: string;
  name: string;
  method: string;
  url: string;
  headers: RequestHeader[];
  parameters: RequestParameter[];
  body: RequestBody;
  auth: RequestAuth;
  response?: {
    status?: number;
    statusText?: string;
    headers?: Record<string, string>;
    data?: any;
    time?: number;
    size?: number;
  };
  isSaving: boolean;
  isDirty: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RestState {
  tabs: TabData[];
  activeTabId: string | null;
  isLoading: boolean;
  error: string | null;
  environments: Array<{
    id: string;
    name: string;
    variables: Array<{ key: string; value: string }>;
  }>;
  activeEnvironmentId: string | null;
}

export const initialTabState: Omit<TabData, 'id' | 'createdAt' | 'updatedAt'> = {
  name: 'New Request',
  method: 'GET',
  url: 'https://echo.hoppscotch.io',
  headers: [],
  parameters: [],
  body: {
    raw: '',
    formData: [],
    urlEncoded: [],
    binary: '',
    graphQL: {
      query: '',
      variables: '{}',
    },
  },
  auth: { type: 'none' },
  isSaving: false,
  isDirty: true,
};
