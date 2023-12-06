import { Card, Title, BarChart, Subtitle } from '@tremor/react';
import { Autocomplete } from '@mui/joy';
import { useSelector } from 'react-redux';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { selectHistory } from '../../features/history/historySlice.js';

function CausesByFeelingsBar() {
  const { t } = useTranslation();

  const rawData = useSelector(selectHistory);

  const aggCausesByFeelings = useMemo(() => {
    const map = rawData.reduce((acc, cur) => {
      cur.feelings.forEach((feeling) => {
        if (acc[feeling.label]) {
          cur.causes.forEach((cause) => {
            const causeCount = acc[feeling.label][cause.label];
            acc[feeling.label][cause.label] = causeCount ? causeCount + 1 : 1;
          });
        } else {
          acc[feeling.label] = {};
          cur.causes.forEach((cause) => {
            acc[feeling.label][cause.label] = 1;
          });
        }
      });
      return acc;
    }, {});
    return Object.entries(map).map(([label, causes]) => ({ label, ...causes }));
  }, [rawData]);

  const existingCauses = useMemo(() => {
    const set = new Set();
    rawData.forEach((record) => {
      record.causes.forEach((cause) => {
        set.add(cause.label);
      });
    });
    return Array.from(set);
  }, [aggCausesByFeelings]);

  const existingFeelings = useMemo(() => {
    const set = new Set();
    rawData.forEach((record) => {
      record.feelings.forEach((feeling) => {
        set.add(feeling.label);
      });
    });
    return Array.from(set);
  }, [aggCausesByFeelings]);

  const [selectedFeelings, setSelectedFeelings] = useState([]);

  const filteredAggCausesByFeelings = useMemo(() => {
    return aggCausesByFeelings.filter(({ label }) => selectedFeelings.includes(label));
  }, [aggCausesByFeelings, selectedFeelings]);

  return (
    <Card>
      <Title>{ t('dashboards.causesByFeelings') }</Title>
      <Autocomplete
        value={selectedFeelings}
        options={existingFeelings}
        placeholder={t('feelings.feeling')}
        disableCloseOnSelect
        multiple
        onChange={(e, value) => setSelectedFeelings(value)}
      ></Autocomplete>
      <BarChart
        className="mt-6"
        data={filteredAggCausesByFeelings}
        index="label"
        categories={existingCauses}
        yAxisWidth={48}
      />
    </Card>
  );
}

export default CausesByFeelingsBar;
