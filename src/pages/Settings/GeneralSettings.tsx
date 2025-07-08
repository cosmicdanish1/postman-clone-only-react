// File: GeneralSettings.tsx
// Type: Component (general settings panel)
// Imports: React
// Imported by: SettingsPanel.tsx
// Role: Renders the general settings options in the Settings feature.
// Located at: src/pages/Settings/GeneralSettings.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import {
  toggleTelemetry,
  toggleExpandNav,
  toggleSidebarLeft,
  toggleAllExperiments,
} from '../../features/settingsSlice';
import { useTranslation } from 'react-i18next';

const languages = [
  "English", "Afrikaans", "العربية (Arabic)", "Català (Catalan)", "简体中文 (Simplified Chinese)",
  "Čeština (Czech)", "Dansk (Danish)", "Deutsch (German)", "Ελληνικά (Greek)", "Español (Spanish)",
  "Suomalainen (Finnish)", "Français (French)", "עברית (Hebrew)", "Magyar (Hungarian)", "Indonesian",
  "Italiano (Italian)", "日本語 (Japanese)", "한국어 (Korean)", "Nederlands (Dutch)", "Norsk (Norwegian)",
  "Polskie (Polish)", "Português Brasileiro (Brazilian Portuguese)", "Português (Portuguese)",
  "Română (Romanian)", "Русский (Russian)", "Српски (Serbian)", "Svenska (Swedish)", "Türkçe (Turkish)",
  "繁體中文 (Traditional Chinese)", "Українська (Ukrainian)", "Tiếng Việt (Vietnamese)",
  "हिन्दी (Hindi)", "मराठी (Marathi)"
];

const namingOptions = [
  'Descriptive With Spaces',
  'snake_case',
  'camelCase',
];

const encodingOptions = ['Enable', 'Disable', 'Auto'];

const languageMap: Record<string, string> = {
  "English": "en",
  "Afrikaans": "af",
  "العربية (Arabic)": "ar",
  "Català (Catalan)": "ca",
  "简体中文 (Simplified Chinese)": "zh",
  "Čeština (Czech)": "cs",
  "Dansk (Danish)": "da",
  "Deutsch (German)": "de",
  "Ελληνικά (Greek)": "el",
  "Español (Spanish)": "es",
  "Suomalainen (Finnish)": "fi",
  "Français (French)": "fr",
  "עברית (Hebrew)": "he",
  "Magyar (Hungarian)": "hu",
  "Indonesian": "id",
  "Italiano (Italian)": "it",
  "日本語 (Japanese)": "ja",
  "한국어 (Korean)": "ko",
  "Nederlands (Dutch)": "nl",
  "Norsk (Norwegian)": "no",
  "Polskie (Polish)": "pl",
  "Português Brasileiro (Brazilian Portuguese)": "pt",
  "Português (Portuguese)": "pt",
  "Română (Romanian)": "ro",
  "Русский (Russian)": "ru",
  "Српски (Serbian)": "sr",
  "Svenska (Swedish)": "sv",
  "Türkçe (Turkish)": "tr",
  "繁體中文 (Traditional Chinese)": "zh",
  "Українська (Ukrainian)": "uk",
  "Tiếng Việt (Vietnamese)": "vi",
  "हिन्दी (Hindi)": "hi",
  "मराठी (Marathi)": "mr"
};

// GeneralSettings is responsible for the General card in the settings page.
// It manages global app settings such as:
// - Language selection (with dropdown and search)
// - Query Parameters Encoding (radio group)
// - Experiments toggles (Telemetry, Expand navigation, Sidebar on left, All Experiments, Experimental scripting sandbox)
// - Request Naming Style (shown only if All Experiments is enabled)
// - Telemetry opt-out modal
// All toggles are connected to Redux state for global effect.
const GeneralSettings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState(languages[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const telemetry = useSelector((state: RootState) => state.settings.telemetry);
  const expandNav = useSelector((state: RootState) => state.settings.expandNav);
  const sidebarLeft = useSelector((state: RootState) => state.settings.sidebarLeft);
  const allExperiments = useSelector((state: RootState) => state.settings.allExperiments);
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);
  const [namingStyle, setNamingStyle] = useState(namingOptions[0]);
  const [namingDropdownOpen, setNamingDropdownOpen] = useState(false);
  const namingDropdownRef = useRef<HTMLDivElement>(null);
  const [experimentalSandbox, setExperimentalSandbox] = useState(false);
  const [encoding, setEncoding] = useState('Enable');
  const theme = useSelector((state: any) => state.theme.theme);

  const handleLanguageChange = (lang: string) => {
    const langKey = languageMap[lang] || 'en';
    console.log('Language selected:', lang, '->', langKey);
    i18n.changeLanguage(langKey);
    setSelected(lang);
    setDropdownOpen(false); // Close dropdown after selection
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [dropdownOpen]);

  const filteredLanguages = languages.filter(lang =>
    lang.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`space-y-10 theme-${theme} bg-bg text-text border-border`}>
    {/* Language */}
    <div>
        <label className="block text-sm font-semibold text-text-secondary mb-5">{t('language')}</label>
        <div className="relative w-48" ref={dropdownRef}>
          <button
            type="button"
            tabIndex={0}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
            aria-controls="language-dropdown-listbox"
            onClick={() => setDropdownOpen((open) => !open)}
            className="w-full bg-bg size-8 text-text-secondary rounded px-3 py-2 flex justify-between items-center focus:outline-none border border-border"
          >
            <span className="mr-2">🌐</span>
            <span>{selected}</span>
            <span className="ml-2 text-xs">&#9662;</span>
          </button>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                id="language-dropdown-listbox"
                role="listbox"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="absolute z-50 w-[220px] h-56 overflow-y-auto bg-bg rounded shadow-inner mt-1 border border-border custom-scrollbar"
                style={{ scrollbarWidth: 'none', pointerEvents: 'auto' }}
              >
                <div className="flex items-center px-2 pt-2 pb-1">
                  <span className="mr-2">🌐</span>
                  <span className="text-xs text-text-secondary">{t('language')}</span>
                </div>
                <div className="sticky top-0 z-10 bg-bg-secondary pb-2">
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={t('language') + '...'}
                    className="w-full px-2 py-1 rounded bg-bg text-text-secondary text-sm focus:outline-none border border-border"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  {filteredLanguages.length === 0 ? (
                    <div className="text-text-secondary text-sm px-3 py-2">{t('no_results')}</div>
                  ) : (
                    filteredLanguages.map(lang => (
                      <button
                        key={lang}
                        type="button"
                        role="option"
                        aria-selected={selected === lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={`w-full text-left px-3 py-1 rounded text-sm transition-colors ${selected === lang ? 'bg-accent text-text-primary' : 'text-text hover:bg-bg-secondary'}`}
                        style={{ pointerEvents: 'auto' }}
                      >
                        {lang}
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </div>
    {/* Query Parameters Encoding */}
    <div>
        <label className="block text-sm font-semibold text-text-secondary mb-1">
          {t('query_parameters_encoding')}
        </label>
        <span className="text-sm text-text-secondary">{t('query_parameters_encoding_desc')}</span>

        {/* Stack vertically and black background for radio */}
        <div className="flex flex-col gap-4 pt-5">
          {encodingOptions.map(option => (
            <label key={option} className="flex items-center gap-3 text-text-secondary text-sm cursor-pointer">
              <button
                type="button"
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition focus:outline-none group ${
                  encoding === option ? 'border-accent' : 'border-border'
                }`}
                onClick={() => setEncoding(option)}
                aria-pressed={encoding === option}
              >
                {encoding === option && (
                  <span className="w-1.5 h-1.5 rounded-full block" style={{ background: '#3b82f6' }} />
                )}
              </button>
              <span>{option}</span>
        </label>
          ))}
        </div>
      </div>

    {/* Experiments */}
    <div>
      <label className="block text-sm font-semibold text-text-secondary mb-2">{t('experiments')}</label>
        <div className="my-1 text-text-secondary text-sm">{t('experiments_desc')}</div>
         <div className="space-y-4 mt-6">

  {/* Telemetry */}
  <label className="flex items-center justify-start gap-5  text-sm text-text-secondary font-semibold hover:text-text-primary">
    <button
      type="button"
      className="relative inline-flex items-center cursor-pointer w-8 h-4 focus:outline-none group"
      onClick={() => {
        if (telemetry) {
          setShowTelemetryModal(true);
        } else {
          dispatch(toggleTelemetry());
        }
      }}
      aria-pressed={telemetry}
    >
      <span
        className={`absolute inset-0 rounded-full border transition-colors duration-200 border-border group-hover:border-accent ${
          telemetry ? '' : 'bg-bg'
        }`}
      />
      <span
        className={`absolute left-1 top-1 w-2 h-2 rounded-full transition-all duration-200 ${
          telemetry
            ? "translate-x-4 bg-accent shadow-lg"
            : "bg-text-secondary"
        }`}
      />
      <input
        type="checkbox"
        className="sr-only"
        checked={telemetry}
        onChange={() => {
          if (telemetry) {
            setShowTelemetryModal(true);
          } else {
            dispatch(toggleTelemetry());
          }
        }}
        tabIndex={-1}
        aria-hidden="true"
      />
    </button>
    {t('telemetry')}
        </label>

  {/* Telemetry Opt-out Modal */} 
  <AnimatePresence>
    {showTelemetryModal && (
      <div className="fixed inset-0 z-50 flex items-start justify-center  bg-black bg-opacity-60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.25 }}
          className="bg-bg rounded-lg shadow-lg  border-[1px] border-border border-opacity-40 p-6 w-full max-w-fit relative mt-10"
          style={{ marginTop: '3rem' }}
        >
          <button
            className="absolute top-3 right-3 text-text-secondary hover:text-text-primary text-xl"
            onClick={() => setShowTelemetryModal(false)}
            aria-label="Close"
          >
            &times;
          </button>
          <div className="text-center">
            <div className="text-lg font-semibold text-text-primary mb-2">{t('confirm')}</div>
            <div className="h-px max-w- opacity-40 bg-border rounded m-2" />
    
            <div className="text-text-secondary text-sm mb-6">
              {t('telemetry_optout_desc')}
            </div>
            <div className="h-px max-w- opacity-40 bg-border rounded m-2" />
            <div className="flex justify-center gap-3">
              <button
                className="px-5 py-2 rounded bg-accent text-text-primary font-semibold hover:bg-accent-dark focus:outline-none"
                onClick={() => {
                  dispatch(toggleTelemetry());
                  setShowTelemetryModal(false);
                }}
              >
                {t('yes')}
              </button>
              <button
                className="px-5 py-2 rounded bg-bg-secondary text-text-secondary font-semibold hover:bg-bg-secondary-dark focus:outline-none"
                onClick={() => setShowTelemetryModal(false)}
              >
                {t('no')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>

  {/* Expand navigation */} 
  <label className="flex items-center justify-start gap-5  text-sm  text-text-secondary font-semibold hover:text-text-primary">
    <button
      type="button"
      className="relative inline-flex items-center cursor-pointer w-8 h-4 focus:outline-none group"
      onClick={() => dispatch(toggleExpandNav())}
      aria-pressed={expandNav}
    >
      <span
        className={`absolute inset-0 rounded-full border transition-colors duration-200 border-border group-hover:border-accent ${
          expandNav ? '' : 'bg-bg'
        }`}
      />
      <span
        className={`absolute left-1 top-1 w-2 h-2 rounded-full transition-all duration-200 ${
          expandNav
            ? "translate-x-4 bg-accent shadow-lg"
            : "bg-text-secondary"
        }`}
      />
      <input
        type="checkbox"
        className="sr-only"
        checked={expandNav}
        onChange={() => dispatch(toggleExpandNav())}
        tabIndex={-1}
        aria-hidden="true"
      />
    </button>
    Expand navigation
        </label>

  {/* Sidebar on left */} 
  <label className="flex items-center justify-start gap-5  text-sm  text-text-secondary font-semibold hover:text-text-primary">
    <button
      type="button"
      className="relative inline-flex items-center cursor-pointer w-8 h-4 focus:outline-none group"
      onClick={() => dispatch(toggleSidebarLeft())}
      aria-pressed={sidebarLeft}
    >
      <span
        className={`absolute inset-0 rounded-full border transition-colors duration-200 border-border group-hover:border-accent ${
          sidebarLeft ? '' : 'bg-bg'
        }`}
      />
      <span
        className={`absolute left-1 top-1 w-2 h-2 rounded-full transition-all duration-200 ${
          sidebarLeft
            ? "translate-x-4 bg-accent shadow-lg"
            : "bg-text-secondary"
        }`}
      />
      <input
        type="checkbox"
        className="sr-only"
        checked={sidebarLeft}
        onChange={() => dispatch(toggleSidebarLeft())}
        tabIndex={-1}
        aria-hidden="true"
      />
    </button>
    Sidebar on left
        </label>

  {/* All Experiments */} 
  <label className="flex items-center justify-start gap-5  text-sm  text-text-secondary font-semibold hover:text-text-primary">
    <button
      type="button"
      className="relative inline-flex items-center cursor-pointer w-8 h-4 focus:outline-none group"
      onClick={() => dispatch(toggleAllExperiments())}
      aria-pressed={allExperiments}
    >
      <span
        className={`absolute inset-0 rounded-full border transition-colors duration-200 border-border group-hover:border-accent ${
          allExperiments ? '' : 'bg-bg'
        }`}
      />
      <span
        className={`absolute left-1 top-1 w-2 h-2 rounded-full transition-all duration-200 ${
          allExperiments
            ? "translate-x-4 bg-accent shadow-lg"
            : "bg-text-secondary"
        }`}
      />
      <input
        type="checkbox"
        className="sr-only"
        checked={allExperiments}
        onChange={() => dispatch(toggleAllExperiments())}
        tabIndex={-1}
        aria-hidden="true"
      />
    </button>
    All Experiments
        </label>

  {allExperiments && (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.25 }}
    >
      <label className="block text-sm font-semibold text-text-secondary mb-2">Request Naming Style</label>
      <div className="relative w-full max-w-xs" ref={namingDropdownRef}>
        <button
          type="button"
          className="w-full bg-bg text-text-secondary font-semibold text-[14px] rounded px-3 py-2 border border-border border-opacity-35 focus:outline-none flex justify-between items-center"
          onClick={() => setNamingDropdownOpen((open) => !open)}
        >
          <span>{namingStyle}</span>
          <span className="ml-2 text-xs">&#9662;</span>
        </button>
        <AnimatePresence>
          {namingDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 bottom-full mb-2 w-full z-20"
            >
              <div className="flex flex-col">
                {namingOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setNamingStyle(option);
                      setNamingDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg shadow transition-all text-[14px] font-semibold focus:outline-none bg-bg hover:bg-bg-secondary hover:shadow-lg ${
                      namingStyle === option ? 'text-accent' : 'text-text-secondary'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )}

  {/* Experimental scripting sandbox */} 
  <label className="flex items-center justify-start gap-5  text-sm text-text-secondary font-semibold hover:text-text-primary">
    <button
      type="button"
      className="relative inline-flex items-center cursor-pointer w-8 h-4 focus:outline-none group"
      onClick={() => setExperimentalSandbox((v) => !v)}
      aria-pressed={experimentalSandbox}
    >
      <span
        className={`absolute inset-0 rounded-full border transition-colors duration-200 border-border group-hover:border-accent ${
          experimentalSandbox ? '' : 'bg-bg'
        }`}
      />
      <span
        className={`absolute left-1 top-1 w-2 h-2 rounded-full transition-all duration-200 ${
          experimentalSandbox
            ? 'translate-x-4 bg-accent shadow-lg'
            : 'bg-text-secondary'
        }`}
      />
      <input
        type="checkbox"
        className="sr-only"
        checked={experimentalSandbox}
        onChange={() => setExperimentalSandbox((v) => !v)}
        tabIndex={-1}
        aria-hidden="true"
      />
    </button>
    Experimental scripting sandbox
  </label>

    </div>

    </div>
      {/* Add style for custom red scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ef4444;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar {
          scrollbar-color: #ef4444 transparent;
          scrollbar-width: thin;
        }
      `}</style>
  </div>
);
};

export default GeneralSettings; 