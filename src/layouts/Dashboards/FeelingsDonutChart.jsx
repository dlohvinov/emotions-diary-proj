import { Card, Title, DonutChart, Legend } from '@tremor/react';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

function FeelingsDonutChart() {
  const { t } = useTranslation();

  const rawData = useSelector((state) => state.history.history);

  const aggFeelingsCount = useMemo(() => {
    const map = rawData.reduce((acc, cur) => {
      cur.feelings.forEach((feeling) => {
        if (acc[feeling.name]) {
          acc[feeling.name] += 1;
        } else {
          acc[feeling.name] = 1;
        }
      });
      return acc;
    }, {});
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [rawData]);

  const legend = useMemo(() => {
    return aggFeelingsCount.map(({ name }) => name);
  }, [aggFeelingsCount]);


  return (
    <Card className="w-full">
      <Title>{t('Feelings count')}</Title>
      <DonutChart
        className="mt-6"
        data={aggFeelingsCount}
        category="count"
        index="name"
      />
      <Legend
        className="mt-6"
        categories={legend}
      ></Legend>
    </Card>
  );
}

export default FeelingsDonutChart;
