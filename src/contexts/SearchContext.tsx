import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

type SearchCategory = 'all' | 'requests' | 'collections' | 'environments' | 'variables' | 'documentation';

interface SearchResult {
  id: string;
  type: 'request' | 'collection' | 'environment' | 'command' | 'documentation';
  title: string;
  description?: string;
  category: SearchCategory;
  action: () => void;
  icon?: React.ReactNode;
  metadata?: Record<string, unknown>;
}

interface SearchContextType {
  isOpen: boolean;
  query: string;
  activeCategory: SearchCategory;
  results: SearchResult[];
  recentSearches: string[];
  openSearch: () => void;
  closeSearch: () => void;
  setQuery: (query: string) => void;
  setActiveCategory: (category: SearchCategory) => void;
  executeSearch: (query: string) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const openSearch = useCallback(() => {
    setIsOpen(true);
    // Focus on input will be handled by the SearchModal component
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  }, []);

  const executeSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    // TODO: Implement actual search logic
    // This is a mock implementation
    const mockResults: SearchResult[] = [
      {
        id: '1',
        type: 'request',
        title: 'Get User Details',
        description: 'GET /api/users/{userId}',
        category: 'requests',
        action: () => console.log('Navigate to request')
      },
      {
        id: '2',
        type: 'collection',
        title: 'User Management',
        description: 'Collection with user-related requests',
        category: 'collections',
        action: () => console.log('Open collection')
      }
    ];

    setResults(mockResults);
    
    // Add to recent searches if not already present
    setRecentSearches(prev => 
      [searchQuery, ...prev.filter(item => item !== searchQuery)].slice(0, 5)
    );
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  const value = useMemo(() => ({
    isOpen,
    query,
    activeCategory,
    results,
    recentSearches,
    openSearch,
    closeSearch,
    setQuery,
    setActiveCategory,
    executeSearch,
    clearSearch,
  }), [
    isOpen, 
    query, 
    activeCategory, 
    results, 
    recentSearches, 
    openSearch, 
    closeSearch, 
    executeSearch, 
    clearSearch
  ]);

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
