// File: types.ts
// Type: Type Definitions
// Imports: (none)
// Imported by: Various files across the project
// Role: Contains shared TypeScript types and interfaces used throughout the project.
// Located at: src/types.ts

// Types for HoppscotchClone and related components

export interface Parameter {
  id: string;
  key: string;
  value: string;
  description?: string;
  contentType?: string;
  file?: File | null;
}

export interface Header {
  id: string;
  key: string;
  value: string;
  description: string;
  locked?: boolean;
}

export interface Variable {
  id: string;
  key: string;
  value: string;
}

export interface TabData {
  id: string;
  method: string;
  tabName: string;
  showModal: boolean;
  modalValue: string;
  activeTab: string;
  parameters: Parameter[];
  body: string;
  headers: Header[];
  authorization: string;
  preRequest: string;
  postRequest: string;
  variables: Variable[];
  responseStatus: number | null;
  responseStatusText: string;
  responseHeaders: Header[];
  responseBody: string;
  responseTime: number | null;
  responseSize: number | null;
  isLoading: boolean;
  responseError: string | null;
} 