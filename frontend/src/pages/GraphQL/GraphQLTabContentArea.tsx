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

interface GraphQLTabContentAreaProps {
  activeTabObj: any;
  activeTabId: string;
  updateTab: (id: string, field: string, value: any) => void;
}

const GraphQLTabContentArea: React.FC<GraphQLTabContentAreaProps> = ({ activeTabObj, activeTabId, updateTab }) => {
  const [editHeadersActive, setEditHeadersActive] = React.useState(false);
  // Use theme class hook for consistent theming
  const { themeClass } = useThemeClass();
  return (
    <div className={`flex flex-col flex-1 min-h-0 p-0 bg-bg text-text ${themeClass}`}>
      {activeTabObj.activeTab === 'headers' && (
        <HeadersTabContent
          headers={activeTabObj.headers || []}
          handleHeaderChange={(id, field, value) => updateTab(activeTabId, 'headers', (activeTabObj.headers || []).map((h: any) => h.id === id ? { ...h, [field]: value } : h))}
          handleDeleteHeader={id => updateTab(activeTabId, 'headers', (activeTabObj.headers || []).filter((h: any) => h.id !== id))}
          handleAddHeader={() => updateTab(activeTabId, 'headers', [...(activeTabObj.headers || []), { id: Math.random().toString(36).substr(2, 9), key: '', value: '', description: '' }])}
          editHeadersActive={editHeadersActive}
          setEditHeadersActive={setEditHeadersActive}
          SortableHeaderRow={SortableHeaderRow}
        />
      )}
      {activeTabObj.activeTab === 'query' && (
        <GraphQLQueryEditor
          query={activeTabObj.query || `query Request {\n  method\n  url\n  headers {\n    key\n    value\n  }\n}`}
          onChange={val => updateTab(activeTabId, 'query', val)}
        />
      )}
      {/* Placeholders for Variables, Authorization, etc. */}
      {activeTabObj.activeTab === 'variables' && (
        <GraphQLVariablesEditor
          variables={activeTabObj.variables}
          onChange={val => updateTab(activeTabId, 'variables', val)}
        />
      )}
      {activeTabObj.activeTab === 'authorization' && (
        <AuthorizationTabContent />
      )}
    </div>
  );
};

export default GraphQLTabContentArea; 