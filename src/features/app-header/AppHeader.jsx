import { Grid, Typography, Box, useTheme, Button } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import EmotionPopup from '../emotion-popup/EmotionPopup.jsx';
import UserProfile from '../user/UserProfile.jsx';

function AppHeader() {
  const { t } = useTranslation();

  // const theme = useTheme();
  // console.info(theme);

  return (
    <Box
      component="header"
      sx={{
        boxShadow: 'lg',
        p: 1,
        bgcolor: 'primary.300',
      }}
    >
      <Grid container spacing={1}>
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
        <Grid xs={3}>
          <EmotionPopup
            activator={<Button>Add entry</Button>}
          ></EmotionPopup>
          <UserProfile></UserProfile>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AppHeader;
