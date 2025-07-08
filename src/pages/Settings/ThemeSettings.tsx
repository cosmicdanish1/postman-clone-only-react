// File: ThemeSettings.tsx
// Type: Component (theme settings panel)
// Imports: React
// Imported by: SettingsPanel.tsx
// Role: Renders the theme customization options in the Settings feature.
// Located at: src/pages/Settings/ThemeSettings.tsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme, setAccentColor } from '../../features/themeSlice';
import { FaDesktop, FaSun, FaCloud, FaMoon } from 'react-icons/fa';

const backgrounds = [
  { key: 'system', label: 'System (Dark)', icon: <FaDesktop /> },
  { key: 'light', label: 'Light', icon: <FaSun /> },
  { key: 'dark', label: 'Dark', icon: <FaCloud /> },
  { key: 'black', label: 'Black', icon: <FaMoon /> },
];

const accentColors = [
  { key: 'green', label: 'Green', color: '#22c55e' },
  { key: 'blue', label: 'Blue', color: '#2563eb' },
  { key: 'cyan', label: 'Cyan', color: '#06b6d4' },
  { key: 'purple', label: 'Purple', color: '#7c3aed' },
  { key: 'yellow', label: 'Yellow', color: '#eab308' },
  { key: 'orange', label: 'Orange', color: '#f59e42' },
  { key: 'red', label: 'Red', color: '#ef4444' },
  { key: 'pink', label: 'Pink', color: '#ec4899' },
];

const ThemeSettings: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: any) => state.theme.theme);
  const accentColor = useSelector((state: any) => state.theme.accentColor);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  return (
    <div className={`flex flex-col gap-12 items-start bg-bg text-text theme-${theme}`}>
      <div className="flex-1 space-y-8">
        {/* Background */}
        <div>
          <div className="font-semibold text-text mb-1">Background</div>
          <div className="text-text-secondary text-sm mb-6">
            {backgrounds.find(bg => bg.key === theme)?.label}
          </div>
          <div className="flex gap-2">
            {backgrounds.map(bg => (
              <button
                key={bg.key}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition border ${theme === bg.key ? 'bg-bg border-accent text-accent' : 'bg-bg border-border text-text-secondary hover:border-accent'}`}
                onClick={() => dispatch(setTheme(bg.key))}
                aria-label={bg.label}
              >
                {bg.icon}
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
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition focus:outline-none group ${accentColor === c.key ? 'ring-2 ring-offset-2 ring-accent' : ''}`}
                  style={{ borderColor: c.color, background: 'transparent' }}
                  onClick={() => dispatch(setAccentColor(c.key))}
                  aria-label={c.label}
                  onMouseEnter={() => setHoveredColor(c.key)}
                  onMouseLeave={() => setHoveredColor(null)}
                >
                  {accentColor === c.key && (
                    <span className="w-1.5 h-1.5 rounded-full block" style={{ background: c.color }} />
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