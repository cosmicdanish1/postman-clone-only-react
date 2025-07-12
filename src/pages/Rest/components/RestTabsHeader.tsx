import React from 'react';
import type { RefObject } from 'react';
import TabsBar from '../../../components/TabsBar';

// Props are a thin wrapper around the original <TabsBar> API that RestPage was using.
interface RestTabsHeaderProps {
  tabs: any[];
  activeTabId: string;
  onSwitchTab: (id: string) => void;
  onAddTab: () => void;
  onCloseTab: (id: string) => void;
  canClose: boolean;
  methodColors: Record<string, string>;
  envDropdownOpen: boolean;
  setEnvDropdownOpen: (v: boolean) => void;
  showVarsPopover: boolean;
  setShowVarsPopover: (v: boolean) => void;
  eyeRef: RefObject<HTMLElement>;
  envTab: string;
  setEnvTab: (tab: string) => void;
}

/**
 * A very small wrapper around the common <TabsBar> used in RestPage.
 * Keeping this separate makes the main page component smaller and allows us
 * to evolve the header UI independently.
 */
const RestTabsHeader: React.FC<RestTabsHeaderProps> = (props) => {
  return <TabsBar {...props} />;
};

export default RestTabsHeader;
