import { Autocomplete } from '@mui/joy';
import { Card, Title, LineChart } from '@tremor/react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectHistory } from '../../features/history/historySlice.js';

export default function EmotionByDateChart() {
  const { t } = useTranslation();

  const rawData = useSelector(selectHistory);

  const chartdata3 = [
    {
      date: "Jan 23",
      "2022": 45,
      "2023": 78,
    },
    {
      date: "Feb 23",
      "2022": 52,
      "2023": 71,
    },
    {
      date: "Mar 23",
      "2022": 48,
      "2023": 80,
    },
    {
      date: "Apr 23",
      "2022": 61,
      "2023": 65,
    },
    {
      date: "May 23",
      "2022": 55,
      "2023": 58,
    },
    {
      date: "Jun 23",
      "2022": 67,
      "2023": 62,
    },
  ];

  return (
    <Card>
      <Title>{ t('dashboards.emotionByDate') }</Title>
      <Autocomplete
        value={selectedFeelings}
        options={existingFeelings}
        placeholder={t('feelings.feeling')}
        disableCloseOnSelect
        multiple
        onChange={(e, value) => setSelectedFeelings(value)}
      ></Autocomplete>
      <LineChart
        className="h-72 mt-4"
        data={chartdata3}
        index="date"
        categories={["running"]}
        colors={["blue"]}
        yAxisWidth={30}
      />
    </Card>
  );
}
