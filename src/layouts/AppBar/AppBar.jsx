import {
  Grid,
  Box,
  useTheme,
  Button,
} from '@mui/joy';
import { useTranslation } from 'react-i18next';
import LogPopup from '../LogPopup/LogPopup.jsx';
import UserProfile from '../../features/user/UserProfile.jsx';
import DarkModeSwitch from './DarkModeSwitch.jsx';
import DateFilter from '../../features/filters/DateFilter.jsx';

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
          <DarkModeSwitch />
        </Grid>
        <Grid xs={6} className="flex justify-center">
          <DateFilter />
        </Grid>
        <Grid xs={3} gap={1} className="flex align-center justify-end">
          <LogPopup
            activator={<Button>Add entry</Button>}
          ></LogPopup>
          <UserProfile />
        </Grid>
      </Grid>
    </Box>
  );
}

export default AppBar;
