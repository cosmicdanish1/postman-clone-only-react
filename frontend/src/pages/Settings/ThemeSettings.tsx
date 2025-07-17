// File: ThemeSettings.tsx
// Type: Component (theme settings panel)
// Imports: React
// Imported by: SettingsPanel.tsx
// Role: Renders the theme customization options in the Settings feature.
// Located at: src/pages/Settings/ThemeSettings.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setTheme, setAccentColor } from '../../features/themeSlice';
import { FaDesktop, FaSun, FaCloud, FaMoon } from 'react-icons/fa';
import useThemeClass from '../../hooks/useThemeClass';
import useAccentColor, { type AccentKey } from '../../hooks/useAccentColor';

type ThemeBackground = {
  key: 'system' | 'light' | 'dark' | 'black';
  label: string;
  icon: React.ReactNode;
};

const ThemeSettings: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { theme, themeClass } = useThemeClass();
  const { current: accentColor, currentKey: accentKey, colors: accentColors } = useAccentColor();
  const [hoveredColor, setHoveredColor] = useState<AccentKey | null>(null);

  const backgrounds: ThemeBackground[] = [
    { key: 'system', label: t('app_theme.backgrounds.system'), icon: <FaDesktop /> },
    { key: 'light', label: t('app_theme.backgrounds.light'), icon: <FaSun /> },
    { key: 'dark', label: t('app_theme.backgrounds.dark'), icon: <FaCloud /> },
    { key: 'black', label: t('app_theme.backgrounds.black'), icon: <FaMoon /> },
  ];

  const handleAccentColorClick = (colorKey: AccentKey) => {
    dispatch(setAccentColor(colorKey));
  };
  
  const handleMouseEnter = (key: AccentKey) => {
    setHoveredColor(key);
  };
  
  const handleMouseLeave = () => {
    setHoveredColor(null);
  };

  return (
    <div className={`flex flex-col gap-12 items-start bg-bg text-text ${themeClass}`}>
      <div className="flex-1 space-y-8">
        {/* Background */}
        <div>
          <div className="font-semibold text-text mb-1">
            {t('app_theme.labels.background')}
          </div>
          <div className="text-text-secondary text-sm mb-6">
            {backgrounds.find(bg => bg.key === theme)?.label}
          </div>
          <div className="flex gap-2">
            {backgrounds.map((bg) => (
              <button
                key={bg.key}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition border ${
                  theme === bg.key ? 'bg-bg border-accent' : 'bg-bg border-border'
                }`}
                onClick={() => dispatch(setTheme(bg.key))}
                aria-label={bg.label}
              >
                {theme === bg.key ? (
                  <span style={{ color: accentColor }}>{bg.icon}</span>
                ) : bg.icon}
              </button>
            ))}
          </div>
        </div>
        {/* Accent color */}
        <div>
          <div className="font-semibold mb-1 text-text">
            {t('app_theme.labels.accent_color')}
          </div>
          <div className="text-text-secondary text-sm mb-6">
            {accentKey.charAt(0).toUpperCase() + accentKey.slice(1)}
          </div>
          <div className="flex gap-4 items-center">
            {accentColors.map(({ key, value }) => (
              <div key={key} className="relative flex flex-col items-center">
                <button
                  type="button"
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition focus:outline-none group ${
                    accentKey === key ? 'ring-d ring-accent' : ''
                  }`}
                  style={{ 
                    borderColor: value, 
                    background: accentKey === key ? value : 'transparent',
                  }}
                  onClick={() => handleAccentColorClick(key)}
                  onMouseEnter={() => handleMouseEnter(key)}
                  onMouseLeave={handleMouseLeave}
                  aria-label={t(`app_theme.colors.${key}`) || (key.charAt(0).toUpperCase() + key.slice(1))}
                >
                  {accentKey === key && (
                    <span className="w-1.5 h-1.5 rounded-full block" style={{ backgroundColor: 'white' }} />
                  )}
                </button>
                {/* Tooltip for color name on hover */}
                {hoveredColor === key && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-bg text-text text-xs shadow z-10 whitespace-nowrap pointer-events-none animate-fade-in">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;

<style>{`
@keyframes fade-in { from { opacity: 0; transform: translateY(8px);} to { opacity: 1; transform: translateY(0);} }
.animate-fade-in { animation: fade-in 0.18s ease; }
`}</style> 