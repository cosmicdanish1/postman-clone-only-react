// File: InterceptorCard.tsx
// Type: Component (interceptor card)
// Imports: React, react-i18next
// Imported by: InterceptorSettings.tsx
// Role: Renders a card UI for an HTTP interceptor in the Settings feature.
// Located at: src/pages/Settings/InterceptorCard.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChrome, FaFirefox } from 'react-icons/fa';
import useThemeClass from '../../hooks/useThemeClass';

type CSSProperties = React.CSSProperties & {
  '--tw-shadow'?: string;
  '--tw-shadow-colored'?: string;
};

const interceptorOptions = [
  'browser',
  'proxy',
  'agent',
  'browser_extension',
];

const BrowserExtensionSection: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="mt-3 pt-3 border-t border-border">
      <div className="text-text-secondary text-sm mb-2">
        {t('interceptor.extension_version', { version: t('common.not_reported') })}
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded border transition-colors duration-200 font-medium hover:shadow-sm"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text)'
          } as CSSProperties}
          onClick={() => window.open('https://chromewebstore.google.com/detail/hoppscotch-browser-extens/amknoiejhlmhancpahfcfcfhllgkpbld', '_blank')}
        >
          <FaChrome className="w-4 h-4" style={{ color: '#4285F4' }} />
          {t('browser.chrome')}
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded border transition-colors duration-200 font-medium hover:shadow-sm"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text)'
          } as CSSProperties}
          onClick={() => window.open('https://addons.mozilla.org/en-US/firefox/addon/hoppscotch/', '_blank')}
        >
          <FaFirefox className="w-4 h-4" style={{ color: '#FF7139' }} />
          {t('browser.firefox')}
        </button>
      </div>
    </div>
  );
};

const InterceptorCard: React.FC = () => {
  const { t } = useTranslation();
  const theme = useThemeClass();
  const accentColor = theme.accentColor;
  const [selected, setSelected] = useState('browser_extension');

  return (
    <div 
      className="border rounded-lg shadow-lg p-5 w-80 text-left z-50 transition-colors duration-200"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border)'
      }}
    >
      <div 
        className="font-bold text-lg mb-1"
        style={{ color: 'var(--text-primary)' }}
      >
        {t('interceptor.title')}
      </div>
      <div 
        className="text-sm mb-4"
        style={{ color: 'var(--text-secondary)' }}
      >
        {t('interceptor.description')}
      </div>
      <div className="flex flex-col gap-3 mb-2">
        {interceptorOptions.map((option) => (
          <label 
            key={option} 
            className="flex items-center gap-3 text-sm cursor-pointer group"
            style={{ color: 'var(--text)' }}
          >
            <button
              type="button"
              className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 focus:outline-none"
              style={{
                borderColor: selected === option ? accentColor : 'var(--border)',
                backgroundColor: selected === option ? 'transparent' : 'var(--bg)'
              }}
              onClick={() => setSelected(option)}
              aria-pressed={selected === option}
            >
              {selected === option && (
                <span 
                  className="w-2 h-2 rounded-full block"
                  style={{ backgroundColor: accentColor }}
                />
              )}
            </button>
            <span 
              className={`transition-colors duration-200 ${selected === option ? 'font-semibold' : 'opacity-90'}`}
              style={{
                color: selected === option ? 'var(--text-primary)' : 'var(--text)'
              }}
            >
              {t(`interceptor.options.${option}`)}
            </span>
          </label>
        ))}
      </div>
      {selected === 'browser_extension' && <BrowserExtensionSection />}
    </div>
  );
};

export default InterceptorCard;