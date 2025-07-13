// File: httpMethods.ts
// Type: Constants
// Imports: None
// Imported by: RequestEditorContainer.tsx
// Role: Contains HTTP method constants
// Located at: src/constants/httpMethods.ts

export const METHODS = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
  'CONNECT',
  'TRACE',
] as const;

export type HttpMethod = typeof METHODS[number];
