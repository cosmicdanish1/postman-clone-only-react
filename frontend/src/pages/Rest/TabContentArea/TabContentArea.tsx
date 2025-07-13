// File: TabContentArea.tsx
// Type: Component (main tab content area)
// Imports: React, various tab content components, utility functions
// Imported by: Main request/response editors and layout components
// Role: Renders the main content area for request/response tabs, switching between different tab types.
// Located at: src/components/TabContentArea.tsx

import React from 'react';
import ParametersTabContent from './ParametersTabContent';
import BodyTabContent from './BodyTabContent';
import HeadersTabContent from './HeadersTabContent';
import type { AuthType } from '../../../types';
import AuthorizationTabContent from './AuthorizationTabContent';
import PreRequestTabContent from './PreRequestTabContent';
import PostRequestTabContent from './PostRequestTabContent';
import VariablesTabContent from './VariablesTabContent';

// This is a placeholder for the actual implementation.
// The real implementation will require all props and handlers for each tab's content.
// For now, just render children as a placeholder.

interface TabContentAreaProps {
  activeTab: string;
  // Parameters tab props
  queryParams: any[];
  handleParamChange: (id: string, field: string, value: string) => void;
  handleDeleteParam: (id: string) => void;
  handleDeleteAllParams: () => void;
  handleAddParam: () => void;
  handleDragEnd: (event: any) => void;
  SortableParamRow: React.ComponentType<any>;
  // Body tab props
  contentType: string;
  contentTypeOptions: Array<{ label: string; value: string; isSection?: boolean }>;
  setContentType: (type: string) => void;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  hideScrollbarStyle: React.CSSProperties;
  setActiveTab: (tab: string) => void;
  rawBody: string;
  setRawBody: (body: string) => void;
  // Headers tab props
  headers: any[];
  handleHeaderChange: (id: string, field: string, value: string) => void;
  uuidv4: () => string;
  setTabs: (tabs: any[]) => void;
  activeTabId: string;
  tabs: any[];
  handleDeleteHeader: (id: string) => void;
  handleAddHeader: () => void;
  editHeadersActive: boolean;
  setEditHeadersActive: (v: (prev: boolean) => boolean) => void;
  SortableHeaderRow: React.ComponentType<any>;
  // Authorization tab props
  authorization: AuthType;
  setAuthorization: (auth: AuthType) => void;
  // Pre-request tab props
  preRequestScript: string;
  setPreRequestScript: (script: string) => void;
  insertPreRequestSnippet: (snippet: string) => void;
  highlightPreRequestScript: (script: string) => React.ReactNode;
  preRequestDivRef: React.RefObject<HTMLDivElement>;
  // Post-request tab props
  postRequestScript: string;
  setPostRequestScript: (script: string) => void;
  insertPostRequestSnippet: (snippet: string) => void;
  highlightPostRequestScript: (script: string) => React.ReactNode;
  postRequestDivRef: React.RefObject<HTMLDivElement>;
  // Variables tab props
  variables: any[];
  handleVariableChange: (id: string, field: string, value: string) => void;
  handleDeleteVariable: (id: string) => void;
  handleVariableDragEnd: (event: any) => void;
  SortableVariableRow: React.ComponentType<any>;
}

const TabContentArea: React.FC<TabContentAreaProps> = (props) => {

  if (props.activeTab === 'parameters') {
    const { queryParams, handleParamChange, handleDeleteParam, handleDeleteAllParams, handleAddParam, handleDragEnd, SortableParamRow } = props;
    return (
      <div className="w-full h-full">
        <ParametersTabContent
          queryParams={queryParams}
          handleParamChange={handleParamChange}
          handleDeleteParam={handleDeleteParam}
          handleDeleteAllParams={handleDeleteAllParams}
          handleAddParam={handleAddParam}
          handleDragEnd={handleDragEnd}
          SortableParamRow={SortableParamRow}
        />
      </div>
    );
  }
  if (props.activeTab === 'body') {
    const { contentType, contentTypeOptions, setContentType, dropdownOpen, setDropdownOpen, hideScrollbarStyle, setActiveTab, rawBody, setRawBody } = props;
    return (
      <div className="w-full h-full">
        <BodyTabContent
          contentType={contentType}
          contentTypeOptions={contentTypeOptions}
          setContentType={setContentType}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          hideScrollbarStyle={hideScrollbarStyle}
          setActiveTab={setActiveTab}
          rawBody={rawBody}
          setRawBody={setRawBody}
        />
      </div>
    );
  }
  if (props.activeTab === 'headers') {
    const { headers, handleHeaderChange, handleDeleteHeader, handleAddHeader, editHeadersActive, setEditHeadersActive, SortableHeaderRow } = props;
    return (
      <div className="w-full h-full">
        <HeadersTabContent
          headers={headers}
          handleHeaderChange={handleHeaderChange}
          handleDeleteHeader={handleDeleteHeader}
          handleAddHeader={handleAddHeader}
          editHeadersActive={editHeadersActive}
          setEditHeadersActive={setEditHeadersActive}
          SortableHeaderRow={SortableHeaderRow}
        />
      </div>
    );
  }
  if (props.activeTab === 'authorization') {
    const { authorization, setAuthorization } = props;
    return (
      <div className="w-full h-full">
        <AuthorizationTabContent 
          authType={authorization} 
          setAuthType={setAuthorization} 
        />
      </div>
    );
  }
  if (props.activeTab === 'pre-request') {
    const { preRequestScript, setPreRequestScript, insertPreRequestSnippet } = props;
    return (
      <div className="w-full h-full">
        <PreRequestTabContent
          preRequestScript={preRequestScript}
          setPreRequestScript={setPreRequestScript}
          insertPreRequestSnippet={insertPreRequestSnippet}
        />
      </div>
    );
  }
  if (props.activeTab === 'post-request') {
    const { postRequestScript, setPostRequestScript, insertPostRequestSnippet } = props;
    return (
      <div className="w-full h-full">
        <PostRequestTabContent
          postRequestScript={postRequestScript}
          setPostRequestScript={setPostRequestScript}
          insertPostRequestSnippet={insertPostRequestSnippet}
        />
      </div>
    );
  }
  if (props.activeTab === 'variables') {
    const { variables, handleVariableChange, handleDeleteVariable, handleVariableDragEnd, SortableVariableRow } = props;
    return (
      <div className="w-full h-full">
        <VariablesTabContent
          variables={variables}
          handleVariableChange={handleVariableChange}
          handleDeleteVariable={handleDeleteVariable}
          handleVariableDragEnd={handleVariableDragEnd}
          SortableVariableRow={SortableVariableRow}
        />
      </div>
    );
  }

  // Add more tab content as needed

  return null;
};

export default TabContentArea; 