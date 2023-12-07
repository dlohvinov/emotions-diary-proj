import { Box, Typography } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import FeelingsDonutChart from './FeelingsDonutChart.jsx';
import CausesByFeelingsBar from './CausesByFeelingsBar.jsx';
import EmotionByDateChart from './EmotionByDateChart.jsx';

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
        {t('dashboards.dashboards')}
      </Typography>
      <FeelingsDonutChart />
      <CausesByFeelingsBar />
      <EmotionByDateChart />
    </Box>

  );
}

export default Dashboards;
