import { Grid, Typography, Box, useTheme, Button } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import LogPopup from '../../features/LogPopup/LogPopup.jsx';
import UserProfile from '../../features/user/UserProfile.jsx';

function AppBar() {
  const { t } = useTranslation();

  const theme = useTheme();
  console.info(theme);

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
          <Typography
            className="app-header__title"
            variant="h1"
          >{t('header.title')}
          </Typography>
        </Grid>
        <Grid xs={6}>
          Datepicker goes here
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
