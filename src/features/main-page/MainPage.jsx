import { Box, Grid } from '@mui/joy';
import AppHeader from '../app-header/AppHeader.jsx';
import History from '../history/History.jsx';
import Dashboards from '../dashboards/Dashboards.jsx';

function MainPage() {
  return (
    <Box
      component="main"
      sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <AppHeader></AppHeader>
      <Grid container spacing={1} sx={{ flexGrow: 1 }}>
        <Grid md={5}>
          <History />
        </Grid>
        <Grid md={7}>
          <Dashboards />
        </Grid>
      </Grid>
    </Box>
  );
}

export default MainPage;
