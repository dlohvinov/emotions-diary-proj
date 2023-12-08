import { Autocomplete } from '@mui/joy';
import { Card, Title, LineChart } from '@tremor/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectHistory } from '../../features/history/historySlice.js';

export default function EmotionByDateChart() {
  const { t } = useTranslation();

  const rawData = useSelector(selectHistory);
  const { from, to } = useSelector((state) => state.history.filters.date);

  const feelingsWithDate = useMemo(() => {
    return rawData.map((record) => {
      return ({ feelings: record.feelings, date: record.createdAt });
    });
  }, [rawData]);

  const existingFeelings = useMemo(() => {
    const set = new Set();
    rawData.forEach((record) => {
      record.feelings.forEach((feeling) => {
        set.add(feeling.label);
      });
    });
    return Array.from(set);
  }, [rawData]);


  const [selectedFeelings, setSelectedFeelings] = useState([]);

  const dateIntervalOptions = [
    { value: 'week', label: t('dashboards.interval.week') },
    { value: 'month', label: t('dashboards.interval.month') },
  ];

  const [chartInterval, setChartInterval] = useState(dateIntervalOptions[0]);


  const intervals = [];

  do {
    const dateFrom = new Date(intervals.at(-1) || from);
    let nextInterval;
    if (chartInterval.value === 'week') nextInterval = dateFrom.setDate(dateFrom.getDate() + 7);
    else if (chartInterval.value === 'month') nextInterval = dateFrom.setMonth(dateFrom.getMonth() + 1);
    intervals.push(nextInterval);
  } while(intervals.at(-1) < to);

  const data = useMemo(() => intervals.map((currentInterval, index, intevals) => {
    if (index === 0) return;
    const countedFeelings = selectedFeelings.reduce((count, feeling) => {
      console.info(feeling, feelingsWithDate);
      const feelingByInterval = feelingsWithDate
      .filter((entry) => entry.feelings.some(({ label }) => label === feeling) && entry.date >= intervals[index - 1] && entry.date < currentInterval);
      count[feeling] = feelingByInterval.length;
      return count;
    }, {});

    return {
      date: new Date(interval).toDateString(),
      ...countedFeelings,
    };
  }), [chartInterval, from, to, selectedFeelings]);

  console.info(data);

  return (
    <Card>
      <Title>{ t('dashboards.emotionByDate') }</Title>
      <Autocomplete
        value={chartInterval}
        options={dateIntervalOptions}
        placeholder={t('dashboards.interval.interval')}
        onChange={(e, value) => setChartInterval(value)}
      ></Autocomplete>

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
        data={data}
        index="date"
        categories={selectedFeelings}
        yAxisWidth={30}
      />
    </Card>
  );
}
