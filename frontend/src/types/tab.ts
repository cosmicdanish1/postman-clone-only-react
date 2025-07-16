export interface TabData {
  id: string;
  name: string;
  method: string;
  url: string;
  headers: {
    id: string;
    key: string;
    value: string;
    description: string;
    enabled: boolean;
  }[];
  parameters: {
    id: string;
    key: string;
    value: string;
    description: string;
    enabled: boolean;
  }[];
  body: {
    raw: string;
    formData: Array<{ id: string; key: string; value: string; type: string; enabled: boolean }>;
    urlEncoded: Array<{ id: string; key: string; value: string; description: string; enabled: boolean }>;
    binary: string;
    graphQL: {
      query: string;
      variables: string;
    };
  };
  auth: {
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
  };
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
