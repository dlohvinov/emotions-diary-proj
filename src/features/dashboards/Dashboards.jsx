import { Box, Typography } from '@mui/joy';

function Dashboards() {
  return (
    <Box
      sx={{
        height: '100%',
        minHeight: 0,
        display: 'flex',
        p: 1,
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.surface',
        boxShadow: 'md',
      }}
    >
      <Typography>Dashboards</Typography>
    </Box>
  );
}

export default Dashboards;
