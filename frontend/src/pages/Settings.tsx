import React from 'react';
import { useTranslation } from 'react-i18next';
import SettingsPanel from './Settings/SettingsPanel';

const Settings: React.FC = () => {
  const { t } = useTranslation();
  
  // Set document title
  React.useEffect(() => {
    document.title = t('settings.page_title');
    return () => {
      document.title = 'Hoppscotch';
    };
  }, [t]);

  return <SettingsPanel />;
};

export default Settings;