// File: TabContentArea.tsx
// Type: Component (main tab content area)
// Imports: React, various tab content components, utility functions
// Imported by: Main request/response editors and layout components
// Role: Renders the main content area for request/response tabs, switching between different tab types.
// Located at: src/components/TabContentArea.tsx

import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AnimatePresence, motion } from 'framer-motion';
import ParametersTabContent from './TabContentArea/ParametersTabContent';
import BodyTabContent from './TabContentArea/BodyTabContent';
import HeadersTabContent from './TabContentArea/HeadersTabContent';
import AuthorizationTabContent from './TabContentArea/AuthorizationTabContent';
import PreRequestTabContent from './TabContentArea/PreRequestTabContent';
import PostRequestTabContent from './TabContentArea/PostRequestTabContent';
import VariablesTabContent from './TabContentArea/VariablesTabContent';

// This is a placeholder for the actual implementation.
// The real implementation will require all props and handlers for each tab's content.
// For now, just render children as a placeholder.

interface TabContentAreaProps {
  activeTab: string;
  // Parameters tab
  queryParams: any[];
  handleParamChange: (id: string, field: string, value: string) => void;
  handleDeleteParam: (id: string) => void;
  setFocusedRow: (id: string) => void;
  handleDragEnd: (event: any) => void;
  SortableParamRow: any;
  // Body tab
  contentType: string;
  contentTypeOptions: any[];
  setContentType: (type: string) => void;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  hideScrollbarStyle: React.CSSProperties;
  setActiveTab: (tab: string) => void;
  rawBody: string;
  setRawBody: (body: string) => void;
  // Headers tab
  headers: any[];
  handleHeaderChange: (id: string, field: string, value: string) => void;
  handleDeleteHeader: (id: string) => void;
  handleAddHeader: () => void;
  editHeadersActive: boolean;
  setEditHeadersActive: (v: (prev: boolean) => boolean) => void;
  SortableHeaderRow: any;
  uuidv4: () => string;
  setTabs: any;
  activeTabId: string;
  tabs: any[];
  authorization: string;
  setAuthorization: (auth: string) => void;
  // Pre-request tab
  preRequestScript: string;
  setPreRequestScript: (script: string) => void;
  insertPreRequestSnippet: (snippet: string) => void;
  highlightPreRequestScript: (script: string) => React.ReactNode;
  preRequestDivRef: React.RefObject<HTMLDivElement>;
  // Post-request tab
  postRequestScript: string;
  setPostRequestScript: (script: string) => void;
  insertPostRequestSnippet: (snippet: string) => void;
  highlightPostRequestScript: (script: string) => React.ReactNode;
  postRequestDivRef: React.RefObject<HTMLDivElement>;
  // Variables tab
  variables: any[];
  handleVariableChange: (id: string, field: string, value: string) => void;
  handleDeleteVariable: (id: string) => void;
  handleVariableDragEnd: (event: any) => void;
  SortableVariableRow: any;
  // ...add more as needed
}

const TabContentArea: React.FC<TabContentAreaProps> = (props) => {
  const {
    activeTab,
    queryParams,
    handleParamChange,
    handleDeleteParam,
    setFocusedRow,
    handleDragEnd,
    SortableParamRow,
    contentType,
    contentTypeOptions,
    setContentType,
    dropdownOpen,
    setDropdownOpen,
    hideScrollbarStyle,
    setActiveTab,
    rawBody,
    setRawBody,
    headers,
    handleHeaderChange,
    handleDeleteHeader,
    handleAddHeader,
    editHeadersActive,
    setEditHeadersActive,
    SortableHeaderRow,
    uuidv4,
    setTabs,
    activeTabId,
    tabs,
    authorization,
    setAuthorization,
    preRequestScript,
    setPreRequestScript,
    insertPreRequestSnippet,
    highlightPreRequestScript,
    preRequestDivRef,
    postRequestScript,
    setPostRequestScript,
    insertPostRequestSnippet,
    highlightPostRequestScript,
    postRequestDivRef,
    variables,
    handleVariableChange,
    handleDeleteVariable,
    handleVariableDragEnd,
    SortableVariableRow,
  } = props;

  if (activeTab === 'parameters') {
    return (
      <ParametersTabContent
        queryParams={queryParams}
        handleParamChange={handleParamChange}
        handleDeleteParam={handleDeleteParam}
        setFocusedRow={setFocusedRow}
        handleDragEnd={handleDragEnd}
        SortableParamRow={SortableParamRow}
      />
    );
  }

  if (activeTab === 'body') {
    return (
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
    );
  }

  if (activeTab === 'headers') {
    return (
      <HeadersTabContent
        headers={headers}
        handleHeaderChange={handleHeaderChange}
        handleDeleteHeader={handleDeleteHeader}
        handleAddHeader={handleAddHeader}
        editHeadersActive={editHeadersActive}
        setEditHeadersActive={setEditHeadersActive}
        SortableHeaderRow={SortableHeaderRow}
      />
    );
  }

  if (activeTab === 'authorization') {
    return (
      <AuthorizationTabContent
        authorization={authorization}
        setAuthorization={setAuthorization}
      />
    );
  }

  if (activeTab === 'pre-request') {
    return (
      <PreRequestTabContent
        preRequestScript={preRequestScript}
        setPreRequestScript={setPreRequestScript}
        insertPreRequestSnippet={insertPreRequestSnippet}
        highlightPreRequestScript={highlightPreRequestScript}
        preRequestDivRef={preRequestDivRef}
      />
    );
  }

  if (activeTab === 'post-request') {
    return (
      <PostRequestTabContent
        postRequestScript={postRequestScript}
        setPostRequestScript={setPostRequestScript}
        insertPostRequestSnippet={insertPostRequestSnippet}
        highlightPostRequestScript={highlightPostRequestScript}
        postRequestDivRef={postRequestDivRef}
      />
    );
  }

  if (activeTab === 'variables') {
    return (
      <VariablesTabContent
        variables={variables}
        handleVariableChange={handleVariableChange}
        handleDeleteVariable={handleDeleteVariable}
        handleVariableDragEnd={handleVariableDragEnd}
        SortableVariableRow={SortableVariableRow}
      />
    );
  }

  // Add more tab content as needed

  return null;
};

export default TabContentArea; 