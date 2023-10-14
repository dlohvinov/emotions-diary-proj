import {
  Grid,
  Switch,
  Box,
  useTheme,
  Button,
  useColorScheme,
  Typography,
} from '@mui/joy';
import { DateRangePicker } from '@tremor/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LogPopup from '../../features/LogPopup/LogPopup.jsx';
import UserProfile from '../../features/user/UserProfile.jsx';

function AppBar() {
  const { t } = useTranslation();

  const theme = useTheme();
  console.info(theme);

  const { mode, setMode } = useColorScheme();

  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    }
  });

  function toggleColorScheme() {
    const isDark = mode === 'dark';
    document.documentElement.classList.toggle('dark', !isDark);
    setMode(isDark ? 'light' : 'dark');
  }

  return (
    <Box
      component="header"
      sx={{
        boxShadow: 'md',
        p: 2,
        bgcolor: 'background.surface',
      }}
    >
      <Grid container spacing={2}>
        <Grid xs={3}>
          <Switch
            variant="soft"
            checked={mode === 'dark'}
            endDecorator={
              <Typography>{t('reusable.darkMode')}</Typography>
            }
            onChange={toggleColorScheme}
          ></Switch>
        </Grid>
        <Grid xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <DateRangePicker></DateRangePicker>
        </Grid>
        <Grid xs={3} sx={{ display: 'flex' }} gap={1} justifyContent="flex-end">
          <LogPopup
            activator={<Button>Add entry</Button>}
          ></LogPopup>
          <UserProfile></UserProfile>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AppBar;
