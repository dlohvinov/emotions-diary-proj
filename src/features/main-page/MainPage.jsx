import { Box, Grid } from '@mui/joy';
import AppHeader from '../app-header/AppHeader.jsx';
import History from '../history/History.jsx';

function MainPage() {
  return (
    <Box component="main" sx={{ height: '100vh' }}>
      <AppHeader></AppHeader>
      <Grid container spacing={1} height="100%">
        <Grid md={5}>
          <History></History>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MainPage;
