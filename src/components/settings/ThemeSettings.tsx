import React, { useState } from 'react';
import { FaDesktop, FaSun, FaCloud, FaMoon, FaSync } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

// ThemeSettings is responsible for the Theme card in the settings page.
// It allows users to select:
// - App background (System, Light, Cloud, Dark) with icons
// - Accent color (row of colored radio buttons with tooltips)
// Uses ThemeContext for theme state and updates.

const backgrounds = [
  { key: 'system', label: 'System (Dark)', icon: <FaDesktop /> },
  { key: 'light', label: 'Light', icon: <FaSun /> },
  { key: 'cloud', label: 'Cloud', icon: <FaCloud /> },
  { key: 'dark', label: 'Dark', icon: <FaMoon /> },
  
];

const colors = [
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
  const { theme, setTheme, accent, setAccent } = useTheme();
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  return (
    <div className="flex flex-row gap-12 items-start">
      {/* Left: Title and description */}
    
      {/* Right: Controls */}
      <div className="flex-1 space-y-8">
        {/* Background */}
        <div>
          <div className="font-semibold text-zinc-200 mb-1">Background</div>
          <div className="text-zinc-400 text-sm mb-6">
            {backgrounds.find(bg => bg.key === theme)?.label}
          </div>
          <div className="flex gap-2">
            {backgrounds.map(bg => (
              <button
                key={bg.key}
                className={`w-8 h-8  flex  items-center justify-center rounded-lg text-sm  transition ${theme === bg.key ? 'bg-neutral-900 border-[var(--accent)] text-[var(--accent)]' : 'bg-neutral-900 border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}
                onClick={() => setTheme(bg.key as 'system' | 'light' | 'dark')}
                aria-label={bg.label}
              >
                {bg.icon}
              </button>
            ))}
          </div>
        </div>
        {/* Accent color */}
        <div>
          <div className="font-semibold text-zinc-200 mb-1">Accent color</div>
          <div className="text-zinc-400 text-sm mb-6">
            {colors.find(c => c.key === accent)?.label}
          </div>
          <div className="flex gap-4 items-center">
            {colors.map(c => (
              <div key={c.key} className="relative flex flex-col items-center">
                <button
                  type="button"
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition focus:outline-none group`}
                  style={{ borderColor: c.color, background: 'transparent' }}
                  onClick={() => setAccent(c.key as typeof accent)}
                  aria-label={c.label}
                  onMouseEnter={() => setHoveredColor(c.key)}
                  onMouseLeave={() => setHoveredColor(null)}
                >
                  {accent === c.key && (
                    <span className="w-1.5 h-1.5 rounded-full block" style={{ background: c.color }} />
                  )}
                </button>
                {/* Tooltip for color name on hover */}
                {hoveredColor === c.key && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-neutral-800 text-xs text-zinc-200 shadow z-10 whitespace-nowrap pointer-events-none animate-fade-in">
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