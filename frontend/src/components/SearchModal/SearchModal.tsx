import React, { useEffect, useRef } from 'react';
import { useSearch } from '../../contexts/SearchContext';
import { useTranslation } from 'react-i18next';
import { X, Search as SearchIcon, Clock, ChevronRight } from 'lucide-react';

const SearchModal: React.FC = () => {
  const { 
    isOpen, 
    closeSearch, 
    query, 
    setQuery, 
    executeSearch,
    results,
    recentSearches,
    activeCategory,
    setActiveCategory
  } = useSearch();
  
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on Escape
      if (e.key === 'Escape') {
        closeSearch();
      }
      // Focus search on Cmd+K / Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          closeSearch();
        } else {
          // Will be handled by the search bar
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeSearch]);

  if (!isOpen) return null;

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: t('search.all') },
    { id: 'requests', label: t('search.requests') },
    { id: 'collections', label: t('search.collections') },
    { id: 'environments', label: t('search.environments') },
    { id: 'documentation', label: t('search.documentation') },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center pt-20 px-4"
      onClick={closeSearch}
    >
      <div 
        className="w-full max-w-2xl bg-bg rounded-lg shadow-2xl overflow-hidden border border-border"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="relative p-4 border-b border-border">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                executeSearch(e.target.value);
              }}
              placeholder={t('search.placeholder')}
              className="w-full bg-transparent pl-10 pr-4 py-3 text-foreground outline-none text-lg"
              autoComplete="off"
              spellCheck="false"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <kbd className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
                {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
              </kbd>
              <kbd className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground">K</kbd>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex border-b border-border px-4 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-3 py-2 text-sm font-medium whitespace-nowrap ${
                activeCategory === category.id
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveCategory(category.id as any)}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {query ? (
            results.length > 0 ? (
              <div className="divide-y divide-border">
                {results.map((result) => (
                  <button
                    key={result.id}
                    className="w-full text-left p-3 hover:bg-accent/5 flex items-center"
                    onClick={result.action}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground truncate">{result.title}</div>
                      {result.description && (
                        <div className="text-sm text-muted-foreground truncate">
                          {result.description}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                {t('search.no_results')}
              </div>
            )
          ) : (
            <div>
              {recentSearches.length > 0 && (
                <>
                  <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('search.recent_searches')}
                  </div>
                  <div className="divide-y divide-border">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        className="w-full text-left p-3 hover:bg-accent/5 flex items-center text-sm"
                        onClick={() => {
                          setQuery(search);
                          executeSearch(search);
                        }}
                      >
                        <Clock className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span className="truncate">{search}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 text-xs text-muted-foreground border-t border-border bg-muted/10">
          <div className="flex justify-between items-center">
            <div>{t('search.tip')}</div>
            <button
              onClick={closeSearch}
              className="p-1 rounded hover:bg-muted/50"
              aria-label={t('common.close')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
