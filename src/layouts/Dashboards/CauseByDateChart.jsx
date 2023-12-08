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

  const causesWithDate = useMemo(() => {
    return rawData.map((record) => {
      return ({ causes: record.causes, date: record.createdAt });
    });
  }, [rawData]);

  const existingCauses = useMemo(() => {
    const set = new Set();
    rawData.forEach((record) => {
      record.causes.forEach((cause) => {
        set.add(cause.label);
      });
    });
    return Array.from(set);
  }, [rawData]);

  const [selectedCauses, setSelectedCauses] = useState([]);

  const dateIntervalOptions = [
    { value: 'week', label: t('dashboards.interval.week') },
    { value: 'month', label: t('dashboards.interval.month') },
  ];

  const [chartInterval, setChartInterval] = useState(dateIntervalOptions[0]);

  const intervals = [];

  do {
    const dateFrom = new Date(intervals.at(-1) || from);
    let nextInterval;
    if (chartInterval.value ===
      'week') nextInterval = dateFrom.setDate(dateFrom.getDate() + 7);
    else if (chartInterval.value ===
      'month') nextInterval = dateFrom.setMonth(dateFrom.getMonth() + 1);
    intervals.push(nextInterval);
  } while (intervals.at(-1) < to);

  const data = useMemo(() => intervals.reduce((
    collected,
    currentInterval,
    index,
    intervals,
  ) => {
    const prevInterval = intervals[index - 1];
    if (!prevInterval) return collected;

    const countedCauses = selectedCauses.reduce((count, cause) => {
      const causeByInterval = causesWithDate
      .filter((entry) => (
        entry.causes.some(({ label }) => label === cause) && entry.date >=
        prevInterval && entry.date < currentInterval),
      );
      count[cause] = causeByInterval.length;
      return count;
    }, {});

    return [
      ...collected, {
        date: new Date(currentInterval).toLocaleDateString(),
        ...countedCauses,
      },
    ];
  }, []), [chartInterval, from, to, selectedCauses]);


  return (
    <Card>
      <Title>{t('dashboards.causeByDate')}</Title>
      <Autocomplete
        className="mt-4"
        value={chartInterval}
        options={dateIntervalOptions}
        placeholder={t('dashboards.interval.interval')}
        onChange={(e, value) => setChartInterval(value)}
      ></Autocomplete>

      <Autocomplete
        className="mt-4"
        value={selectedCauses}
        options={existingCauses}
        placeholder={t('causes.cause')}
        disableCloseOnSelect
        multiple
        onChange={(e, value) => setSelectedCauses(value)}
      ></Autocomplete>

      <LineChart
        className="h-72 mt-4"
        data={data}
        index="date"
        categories={selectedCauses}
        yAxisWidth={30}
      />
    </Card>
  );
}
