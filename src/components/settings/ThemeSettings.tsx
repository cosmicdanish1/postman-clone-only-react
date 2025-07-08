import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../features/themeSlice';

const themes = [
  { name: 'Light', value: 'light' },
  { name: 'Dark', value: 'dark' },
  { name: 'System', value: 'system' },
];

const ThemeSettings = () => {
  const dispatch = useDispatch();
  const selectedTheme = useSelector((state: any) => state.theme.theme);

  // Update <body> class when theme changes
  useEffect(() => {
    document.body.classList.remove('theme-dark');
    if (selectedTheme === 'dark') {
      document.body.classList.add('theme-dark');
    }
  }, [selectedTheme]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Theme Settings</h2>
      <div className="space-y-2">
        {themes.map(theme => (
          <label key={theme.value} className="block">
            <input
              type="radio"
              name="theme"
              value={theme.value}
              checked={selectedTheme === theme.value}
              onChange={() => dispatch(setTheme(theme.value))}
            />
            <span className="ml-2">{theme.name}</span>
          </label>
        ))}
      </div>
      <div className="mt-6 p-4 rounded bg-bg text-text shadow">
        <p>This box uses the current theme colors!</p>
      </div>
    </div>
  );
};

export default ThemeSettings; 