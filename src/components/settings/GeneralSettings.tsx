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

const languages = [
  "English", "Afrikaans", "العربية (Arabic)", "Català (Catalan)", "简体中文 (Simplified Chinese)",
  "Čeština (Czech)", "Dansk (Danish)", "Deutsch (German)", "Ελληνικά (Greek)", "Español (Spanish)",
  "Suomalainen (Finnish)", "Français (French)", "עברית (Hebrew)", "Magyar (Hungarian)", "Indonesian",
  "Italiano (Italian)", "日本語 (Japanese)", "한국어 (Korean)", "Nederlands (Dutch)", "Norsk (Norwegian)",
  "Polskie (Polish)", "Português Brasileiro (Brazilian Portuguese)", "Português (Portuguese)",
  "Română (Romanian)", "Русский (Russian)", "Српски (Serbian)", "Svenska (Swedish)", "Türkçe (Turkish)",
  "繁體中文 (Traditional Chinese)", "Українська (Ukrainian)", "Tiếng Việt (Vietnamese)"
];

const namingOptions = [
  'Descriptive With Spaces',
  'snake_case',
  'camelCase',
];

const encodingOptions = ['Enable', 'Disable', 'Auto'];

// GeneralSettings is responsible for the General card in the settings page.
// It manages global app settings such as:
// - Language selection (with dropdown and search)
// - Query Parameters Encoding (radio group)
// - Experiments toggles (Telemetry, Expand navigation, Sidebar on left, All Experiments, Experimental scripting sandbox)
// - Request Naming Style (shown only if All Experiments is enabled)
// - Telemetry opt-out modal
// All toggles are connected to Redux state for global effect.
const GeneralSettings: React.FC = () => {
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const filteredLanguages = languages.filter(lang =>
    lang.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Language */} 
      <div>
        <label className="block text-sm font-semibold text-zinc-300 mb-5">Language</label>
        <div className="relative w-48" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((open) => !open)}
            className="w-full bg-neutral-900 size-8 text-gray-400 rounded px-3 py-2 flex justify-between items-center focus:outline-none border border-neutral-700"
          >
            <span className="mr-2">🌐</span>
            <span>{selected}</span>
            <span className="ml-2 text-xs">&#9662;</span>
          </button>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="absolute z-10 w-[220px] h-56 overflow-y-auto bg-neutral-900 rounded shadow-inner mt-1 border border-zinc-700 custom-scrollbar"
                style={{ scrollbarWidth: 'none' }}
              >
                <div className="flex items-center px-2 pt-2 pb-1">
                  <span className="mr-2">🌐</span>
                  <span className="text-xs text-zinc-400">Language</span>
                </div>
                <div className="sticky top-0 z-10 bg-zinc-800 pb-2">
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search language..."
                    className="w-full px-2 py-1 rounded bg-neutral-900 text-zinc-200 text-sm focus:outline-none border border-gray-600"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  {filteredLanguages.length === 0 ? (
                    <div className="text-zinc-400 text-sm px-3 py-2">No results</div>
                  ) : (
                    filteredLanguages.map(lang => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => { setSelected(lang); setDropdownOpen(false); setSearch(""); }}
                        className={`w-full text-left px-3 py-1 rounded text-sm transition-colors ${selected === lang ? 'bg-blue-600 text-white' : 'text-zinc-200 hover:bg-zinc-700'}`}
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
        <label className="block text-sm font-semibold text-zinc-300 mb-1">
          Query Parameters Encoding
        </label>
        <span className="text-sm text-gray-500">Configure encoding for query parameters in requests</span>

        {/* Stack vertically and black background for radio */}
        <div className="flex flex-col gap-4 pt-5">
          {encodingOptions.map(option => (
            <label key={option} className="flex items-center gap-3 text-zinc-200 text-sm cursor-pointer">
              <button
                type="button"
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition focus:outline-none group ${
                  encoding === option ? 'border-blue-500' : 'border-gray-400/30'
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
        <label className="block text-sm font-semibold text-zinc-300 mb-2">Experiments</label>
        <div className="my-1 text-gray-400 text-sm">This is a collection of experiments we're working on that might turn out to be useful, fun, both, or neither. They're not final and may not be stable, so if something overly weird happens, don't panic.
           Just turn the dang thing off. Jokes aside,  <a aria-label="Link" href="https://github.com/hoppscotch/hoppscotch/issues/new/choose" role="link" target="_blank" rel="noopener" className="inline-flex items-center justify-center text-blue-500 focus:outline-none hover:text-secondaryDark focus-visible:text-secondaryDark link" tabIndex={0}> Contact us</a>. </div>
         <div className="space-y-4 mt-6">

  {/* Telemetry */}
  <label className="flex items-center justify-start gap-5  text-sm text-neutral-500 font-semibold hover:text-white">
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
        className={`absolute inset-0 rounded-full border transition-colors duration-200 border-gray-400/30 group-hover:border-blue-500 ${
          telemetry ? '' : 'bg-neutral-900'
        }`}
      />
      <span
        className={`absolute left-1 top-1 w-2 h-2 rounded-full transition-all duration-200 ${
          telemetry
            ? "translate-x-4 bg-blue-400 shadow-lg"
            : "bg-gray-500"
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
    Telemetry
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
          className="bg-neutral-900 rounded-lg shadow-lg  border-[1px] border-neutral-400 border-opacity-40 p-6 w-full max-w-fit relative mt-10"
          style={{ marginTop: '3rem' }}
        >
          <button
            className="absolute top-3 right-3 text-zinc-400 hover:text-white text-xl"
            onClick={() => setShowTelemetryModal(false)}
            aria-label="Close"
          >
            &times;
          </button>
          <div className="text-center">
            <div className="text-lg font-semibold text-white mb-2">Confirm</div>
            <div className="h-px max-w- opacity-40 bg-zinc-700 rounded m-2" />
    
            <div className="text-gray-400 text-sm mb-6">
              Are you sure you want to opt-out of Telemetry? Telemetry helps us to personalize <br /> our operations and deliver the best experience to you.
            </div>
            <div className="h-px max-w- opacity-40 bg-zinc-700 rounded m-2" />
            <div className="flex justify-center gap-3">
              <button
                className="px-5 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none"
                onClick={() => {
                  dispatch(toggleTelemetry());
                  setShowTelemetryModal(false);
                }}
              >
                Yes
              </button>
              <button
                className="px-5 py-2 rounded bg-neutral-800 text-zinc-200 font-semibold hover:bg-neutral-700 focus:outline-none"
                onClick={() => setShowTelemetryModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>

  {/* Expand navigation */} 
  <label className="flex items-center justify-start gap-5  text-sm  text-neutral-500 font-semibold hover:text-white">
    <button
      type="button"
      className="relative inline-flex items-center cursor-pointer w-8 h-4 focus:outline-none group"
      onClick={() => dispatch(toggleExpandNav())}
      aria-pressed={expandNav}
    >
      <span
        className={`absolute inset-0 rounded-full border transition-colors duration-200 border-gray-400/30 group-hover:border-blue-500 ${
          expandNav ? '' : 'bg-neutral-900'
        }`}
      />
      <span
        className={`absolute left-1 top-1 w-2 h-2 rounded-full transition-all duration-200 ${
          expandNav
            ? "translate-x-4 bg-blue-400 shadow-lg"
            : "bg-gray-500"
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
  <label className="flex items-center justify-start gap-5  text-sm  text-neutral-500 font-semibold hover:text-white">
    <button
      type="button"
      className="relative inline-flex items-center cursor-pointer w-8 h-4 focus:outline-none group"
      onClick={() => dispatch(toggleSidebarLeft())}
      aria-pressed={sidebarLeft}
    >
      <span
        className={`absolute inset-0 rounded-full border transition-colors duration-200 border-gray-400/30 group-hover:border-blue-500 ${
          sidebarLeft ? '' : 'bg-neutral-900'
        }`}
      />
      <span
        className={`absolute left-1 top-1 w-2 h-2 rounded-full transition-all duration-200 ${
          sidebarLeft
            ? "translate-x-4 bg-blue-400 shadow-lg"
            : "bg-gray-500"
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
  <label className="flex items-center justify-start gap-5  text-sm  text-neutral-500 font-semibold hover:text-white">
    <button
      type="button"
      className="relative inline-flex items-center cursor-pointer w-8 h-4 focus:outline-none group"
      onClick={() => dispatch(toggleAllExperiments())}
      aria-pressed={allExperiments}
    >
      <span
        className={`absolute inset-0 rounded-full border transition-colors duration-200 border-gray-400/30 group-hover:border-blue-500 ${
          allExperiments ? '' : 'bg-neutral-900'
        }`}
      />
      <span
        className={`absolute left-1 top-1 w-2 h-2 rounded-full transition-all duration-200 ${
          allExperiments
            ? "translate-x-4 bg-blue-400 shadow-lg"
            : "bg-gray-500"
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
      <label className="block text-sm font-semibold text-gray-500 mb-2">Request Naming Style</label>
      <div className="relative w-full max-w-xs" ref={namingDropdownRef}>
        <button
          type="button"
          className="w-full bg-neutral-900 text-gray-500 font-semibold text-[14px] rounded px-3 py-2 border border-neutral-50 border-opacity-35 focus:outline-none flex justify-between items-center"
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
                    className={`w-full text-left px-4 py-3 rounded-lg shadow transition-all text-[14px] font-semibold focus:outline-none bg-neutral-900 hover:bg-neutral-800 hover:shadow-lg ${
                      namingStyle === option ? 'text-blue-400' : 'text-gray-400'
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
  <label className="flex items-center justify-start gap-5  text-sm text-neutral-500 font-semibold hover:text-white">
    <button
      type="button"
      className="relative inline-flex items-center cursor-pointer w-8 h-4 focus:outline-none group"
      onClick={() => setExperimentalSandbox((v) => !v)}
      aria-pressed={experimentalSandbox}
    >
      <span
        className={`absolute inset-0 rounded-full border transition-colors duration-200 border-gray-400/30 group-hover:border-blue-500 ${
          experimentalSandbox ? '' : 'bg-neutral-900'
        }`}
      />
      <span
        className={`absolute left-1 top-1 w-2 h-2 rounded-full transition-all duration-200 ${
          experimentalSandbox
            ? 'translate-x-4 bg-blue-400 shadow-lg'
            : 'bg-gray-500'
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