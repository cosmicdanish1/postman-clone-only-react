// File: GraphQLTabContentArea.tsx
// Type: Component (tab content area for GraphQL tabs)
// Imports: React, MonacoEditor, GraphQLQueryEditor, VariablesTabContent, SortableVariableRow, GraphQLVariablesEditor, HeadersTabContent, SortableHeaderRow, AuthorizationTabContent
// Imported by: GraphQL.tsx
// Role: Displays the content for the active GraphQL tab (query, variables, headers, authorization, etc.).
// Located at: src/pages/GraphQL/GraphQLTabContentArea.tsx
import React from 'react';
import MonacoEditor from '@monaco-editor/react';
import GraphQLQueryEditor from './GraphQLQueryEditor';
import VariablesTabContent from '../../components/TabContentArea/VariablesTabContent';
import SortableVariableRow from '../../components/SortableVariableRow';
import GraphQLVariablesEditor from './GraphQLVariablesEditor';
import HeadersTabContent from '../../components/TabContentArea/HeadersTabContent';
import SortableHeaderRow from '../../components/SortableHeaderRow';
import AuthorizationTabContent from '../../components/TabContentArea/AuthorizationTabContent';
import { useSelector } from 'react-redux';

interface GraphQLTabContentAreaProps {
  activeTabObj: any;
  activeTabId: string;
  updateTab: (id: string, field: string, value: any) => void;
}

const GraphQLTabContentArea: React.FC<GraphQLTabContentAreaProps> = ({ activeTabObj, activeTabId, updateTab }) => {
  const [editHeadersActive, setEditHeadersActive] = React.useState(false);
  const theme = useSelector((state: any) => state.theme.theme);
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)
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