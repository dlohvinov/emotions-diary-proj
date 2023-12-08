import { Box, Grid } from '@mui/joy';
import { useSelector } from 'react-redux';
import { selectUID } from '../../features/auth/authSlice.js';
import AppBar from '../../layouts/AppBar/AppBar.jsx';
import History from '../../layouts/History/History.jsx';
import Dashboards from '../../layouts/Dashboards/Dashboards.jsx';
import AuthPopup from '../../layouts/AuthPopup/AuthPopup.jsx';

function MainPage() {
  const uid = useSelector(selectUID);
  const alreadyInitialized = useSelector((state) => state.auth.alreadyInitialized);

  return (
    <Box
      component="main"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.body',
      }}
    >
      {alreadyInitialized && !uid && <AuthPopup />}
      <AppBar />
      <Grid
        sx={{
          flexGrow: 2,
          minHeight: 0,
          p: 2,
        }}
        container
      >
        <Grid
          md={5}
          sx={{ height: '100%' }}
        >
          <History />
        </Grid>
        <Grid
          md={7}
          sx={{ height: '100%' }}
        >
          <Dashboards />
        </Grid>
      </Grid>
    </Box>
  );
}

export default MainPage;
