// File: ThemeSettings.tsx
// Type: Component (theme settings panel)
// Imports: React
// Imported by: SettingsPanel.tsx
// Role: Renders the theme customization options in the Settings feature.
// Located at: src/pages/Settings/ThemeSettings.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, setAccentColor } from '../../features/themeSlice';
import { FaDesktop, FaSun, FaCloud, FaMoon } from 'react-icons/fa';
import useThemeClass from '../../hooks/useThemeClass';
import { ACCENT_COLOR_MAP } from '../../hooks/useAccentColor';
import type { RootState } from '../../store';

const backgrounds = [
  { key: 'system', label: 'System (Dark)', icon: <FaDesktop /> },
  { key: 'light', label: 'Light', icon: <FaSun /> },
  { key: 'dark', label: 'Dark', icon: <FaCloud /> },
  { key: 'black', label: 'Black', icon: <FaMoon /> },
];

const accentColors = Object.entries(ACCENT_COLOR_MAP).map(([key, color]) => ({
  key,
  label: key.charAt(0).toUpperCase() + key.slice(1),
  color
}));

const ThemeSettings: React.FC = () => {
  const dispatch = useDispatch();
  const { themeClass, theme } = useThemeClass();
  const accentColor = useSelector((state: RootState) => state.theme.accentColor);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  const handleAccentColorClick = (colorKey: string) => {
    dispatch(setAccentColor(colorKey));
  };

  return (
    <div className={`flex flex-col gap-12 items-start bg-bg text-text ${themeClass}`}>
      <div className="flex-1 space-y-8">
        {/* Background */}
        <div>
          <div className="font-semibold text-text mb-1">Background</div>
          <div className="text-text-secondary text-sm mb-6">
            {backgrounds.find(bg => bg.key === theme)?.label}
          </div>
          <div className="flex gap-2">
            {backgrounds.map((bg) => (
              <button
                key={bg.key}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition border ${theme === bg.key ? 'bg-bg border-accent' : 'bg-bg border-border'}`}
                onClick={() => dispatch(setTheme(bg.key))}
                aria-label={bg.label}
              >
                {theme === bg.key
                  ? <span style={{ color: accentColors.find(ac => ac.key === accentColor)?.color }}>{bg.icon}</span>
                  : bg.icon}
              </button>
            ))}
          </div>
        </div>
        {/* Accent color */}
        <div>
          <div className="font-semibold mb-1 text-text">Accent color</div>
          <div className="text-text-secondary text-sm mb-6">
            {accentColors.find(c => c.key === accentColor)?.label}
          </div>
          <div className="flex gap-4 items-center">
            {accentColors.map(c => (
              <div key={c.key} className="relative flex flex-col items-center">
                <button
                  type="button"
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition focus:outline-none group ${
                    accentColor === c.key ? 'ring-d ring-accent' : ''
                  }`}
                  style={{ 
                    borderColor: c.color, 
                    background: accentColor === c.key ? c.color : 'transparent',
                  }}
                  onClick={() => handleAccentColorClick(c.key)}
                  onMouseEnter={() => setHoveredColor(c.key)}
                  onMouseLeave={() => setHoveredColor(null)}
                  aria-label={c.label}
                >
                  {accentColor === c.key && (
                    <span className="w-1.5 h-1.5 rounded-full block" style={{ backgroundColor: 'white' }} />
                  )}
                </button>
                {/* Tooltip for color name on hover */}
                {hoveredColor === c.key && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-bg text-text text-xs shadow z-10 whitespace-nowrap pointer-events-none animate-fade-in">
                    {c.label}
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