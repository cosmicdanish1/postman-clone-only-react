import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../features/themeSlice';
import { useTranslation } from 'react-i18next';

const themes = [
  { name: 'theme_light', value: 'light' },
  { name: 'theme_dark', value: 'dark' },
  { name: 'theme_system', value: 'system' },
];

const ThemeSettings = () => {
  const dispatch = useDispatch();
  const selectedTheme = useSelector((state: any) => state.theme.theme);
  const { t } = useTranslation();

  // Update <body> class when theme changes
  useEffect(() => {
    document.body.classList.remove('theme-dark');
    if (selectedTheme === 'dark') {
      document.body.classList.add('theme-dark');
    }
  }, [selectedTheme]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">{t('theme_settings')}</h2>
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
            <span className="ml-2">{t(theme.name)}</span>
          </label>
        ))}
      </div>
      <div className="mt-6 p-4 rounded bg-bg text-text shadow">
        <p>{t('theme_box_info')}</p>
      </div>
    </div>
  );
};

export default ThemeSettings; 