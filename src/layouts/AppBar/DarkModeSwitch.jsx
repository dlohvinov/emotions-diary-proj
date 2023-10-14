import { Switch, Typography, useColorScheme } from '@mui/joy';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function DarkModeSwitch() {
  const { t } = useTranslation();

  const { mode, setMode } = useColorScheme();

  const toggleMUIDarkMode = (value) => {
    return setMode(value ? 'dark' : 'light');
  };
  // dashboards dependency
  const toggleTailwindDarkMode = (value) => {
    return document.documentElement.classList.toggle('dark', value);
  };
  const toggleBrowserDarkMode = (value) => {
    return document.documentElement.style.setProperty('color-scheme', value ? 'dark' : 'light');
  };

  useEffect(() => {
    toggleTailwindDarkMode(mode === 'dark');
    toggleBrowserDarkMode(mode === 'dark');
  });

  function toggleColorScheme() {
    toggleMUIDarkMode(mode !== 'dark');
    toggleTailwindDarkMode(mode !== 'dark');
    toggleBrowserDarkMode(mode !== 'dark');
  }

  return (
    <Switch
      variant="soft"
      checked={mode === 'dark'}
      endDecorator={
        <Typography>{t('reusable.darkMode')}</Typography>
      }
      onChange={toggleColorScheme}
    ></Switch>
  );
}

export default DarkModeSwitch;
