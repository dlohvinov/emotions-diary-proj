import { Card, Title, BarChart, Subtitle } from '@tremor/react';
import { Autocomplete } from '@mui/joy';
import { useSelector } from 'react-redux';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

function CausesByFeelingsBar() {
  const { t } = useTranslation();

  const rawData = useSelector((state) => state.history.history);

  const aggCausesByFeelings = useMemo(() => {
    const map = rawData.reduce((acc, cur) => {
      cur.feelings.forEach((feeling) => {
        if (acc[feeling.name]) {
          cur.causes.forEach((cause) => {
            const causeCount = acc[feeling.name][cause.name];
            acc[feeling.name][cause.name] = causeCount ? causeCount + 1 : 1;
          });
        } else {
          acc[feeling.name] = {};
          cur.causes.forEach((cause) => {
            acc[feeling.name][cause.name] = 1;
          });
        }
      });
      return acc;
    }, {});
    return Object.entries(map).map(([name, causes]) => ({ name, ...causes }));
  }, [rawData]);

  const existingCauses = useMemo(() => {
    const set = new Set();
    rawData.forEach((record) => {
      record.causes.forEach((cause) => {
        set.add(cause.name);
      });
    });
    return Array.from(set);
  }, [aggCausesByFeelings]);

  const existingFeelings = useMemo(() => {
    const set = new Set();
    rawData.forEach((record) => {
      record.feelings.forEach((feeling) => {
        set.add(feeling.name);
      });
    });
    return Array.from(set);
  }, [aggCausesByFeelings]);

  const [selectedFeelings, setSelectedFeelings] = useState([]);

  const filteredAggCausesByFeelings = useMemo(() => {
    return aggCausesByFeelings.filter(({ name }) => selectedFeelings.includes(name));
  }, [aggCausesByFeelings, selectedFeelings]);

  return (
    <Card>
      <Title>Causes by Feelings bar</Title>
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
        index="name"
        categories={existingCauses}
        yAxisWidth={48}
      />
    </Card>
  );
}

export default CausesByFeelingsBar;
