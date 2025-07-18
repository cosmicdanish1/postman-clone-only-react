// File: GraphQLTabContentArea.tsx
// Type: Component (tab content area for GraphQL tabs)
// Imports: React, GraphQLQueryEditor, GraphQLVariablesEditor, HeadersTabContent, SortableHeaderRow, AuthorizationTabContent
// Imported by: GraphQL.tsx
// Role: Displays the content for the active GraphQL tab (query, variables, headers, authorization, etc.).
// Located at: src/pages/GraphQL/GraphQLTabContentArea.tsx
import React from 'react';
import GraphQLQueryEditor from './GraphQLQueryEditor';
import GraphQLVariablesEditor from './GraphQLVariablesEditor';
import HeadersTabContent from '../Rest/TabContentArea/HeadersTabContent';
import SortableHeaderRow from '../../components/SortableHeaderRow';
import AuthorizationTabContent from '../Rest/TabContentArea/AuthorizationTabContent';
import useThemeClass from '../../hooks/useThemeClass';
import type { GraphQLTab } from './GraphQLTabBar';
import type { AuthType } from '../../types';

interface Header {
  id: string;
  key: string;
  value: string;
  disabled?: boolean;
}

interface GraphQLTabContentAreaProps {
  activeTabId: string;
  query: string;
  variables: any; // Changed from any[] to any to handle both object and array
  headers: Header[];
  onQueryChange: (query: string) => void;
  onVariablesChange: (variables: any) => void; // Changed to accept any type
  onHeadersChange: (headers: Header[]) => void;
  activeTab?: Partial<GraphQLTab> & {
    authType?: AuthType;
  };
  onUpdateTab?: (id: string, field: string, value: any) => void;
}

const GraphQLTabContentArea: React.FC<GraphQLTabContentAreaProps> = ({
  activeTabId,
  query,
  variables,
  headers = [],
  onQueryChange,
  onVariablesChange,
  onHeadersChange,
  activeTab,
  onUpdateTab
}) => {
  const [editHeadersActive, setEditHeadersActive] = React.useState(false);
  const [initialized, setInitialized] = React.useState(false);
  // Use theme class hook for consistent theming
  const { themeClass } = useThemeClass();

  // Set default query if empty
  React.useEffect(() => {
    if (!initialized && (!query || query.trim() === '')) {
      const defaultQuery = `# Welcome to GraphQL Playground
# Type your query here and click the play button to execute
# Example query to get user data
query GetUserWithPosts($userId: ID!) {
  user(id: $userId) {
    id
    name
    email
    posts {
      id
      title
      body
      comments {
        id
        text
        author {
          id
          name
        }
      }
    }
  }
}

# Uncomment and use these variables in the "Variables" tab
# {
#   "userId": "1"
# }`;
      onQueryChange(defaultQuery);
      setInitialized(true);
    }
  }, [query, onQueryChange, initialized]);
  return (
    <div className={`flex flex-col flex-1 min-h-0 p-0 bg-bg text-text ${themeClass}`}>
      {activeTabId === 'headers' && (
        <HeadersTabContent
          headers={headers}
          handleHeaderChange={(id, field, value) => {
            const updatedHeaders = headers.map(header => 
              header.id === id ? { ...header, [field]: value } : header
            );
            onHeadersChange(updatedHeaders);
          }}
          handleDeleteHeader={id => {
            if (onUpdateTab) {
              onUpdateTab(activeTabId, 'headers', headers.filter(h => h.id !== id));
            }
          }}
          handleAddHeader={() => {
            if (onUpdateTab) {
              onUpdateTab(activeTabId, 'headers', [
                ...headers, 
                { 
                  id: Math.random().toString(36).substr(2, 9), 
                  key: '', 
                  value: '', 
                  description: '' 
                }
              ]);
            }
          }}
          editHeadersActive={editHeadersActive}
          setEditHeadersActive={setEditHeadersActive}
          SortableHeaderRow={SortableHeaderRow}
        />
      )}
      {activeTabId === 'query' && (
        <div className="h-full">
          <GraphQLQueryEditor 
            query={query || ''} 
            onChange={onQueryChange} 
          />
        </div>
      )}
      {activeTabId === 'variables' && (
        <div className="h-full">
          <GraphQLVariablesEditor 
            variables={variables || {}} 
            onChange={(val) => {
              try {
                const parsed = JSON.parse(val);
                onVariablesChange(parsed);
              } catch (e) {
                // If parsing fails, pass an empty object
                onVariablesChange({});
              }
            }} 
          />
        </div>
      )}
      {activeTabId === 'auth' && onUpdateTab && (
        <AuthorizationTabContent 
          authType={activeTab?.authType || 'none'} 
          setAuthType={val => onUpdateTab(activeTabId, 'authType', val)} 
        />
      )}
    </div>
  );
};

export default GraphQLTabContentArea; 