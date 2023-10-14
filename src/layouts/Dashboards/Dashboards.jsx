import { Box, Typography } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import FeelingsDonutChart from './FeelingsDonutChart.jsx';
import CausesByFeelingsBar from './CausesByFeelingsBar.jsx';

function Dashboards() {
  const { t } = useTranslation();

  return (
    <Box
      component="section"
      sx={{
        height: '100%',
        minHeight: 0,
        display: 'flex',
        p: 2,
        bgcolor: 'background.surface',
        boxShadow: 'md',
        flexDirection: 'column',
        gap: 2,
        overflowY: 'auto',
      }}
    >
      <Typography level="h2">
        {t('DASHBOARDS')}
      </Typography>
      <FeelingsDonutChart />
      <CausesByFeelingsBar />
    </Box>

  );
}

export default Dashboards;
