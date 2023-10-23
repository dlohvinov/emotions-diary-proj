import { Card, Title, DonutChart, Legend } from '@tremor/react';
import { getApp } from 'firebase/app';
import {
  collection, getDoc,
  getFirestore,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { selectUserinfo } from '../../features/auth/authSlice.js';

function FeelingsDonutChart() {
  const { t } = useTranslation();

  const userinfo = useSelector(selectUserinfo);
  const db = getFirestore(getApp());

  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    if (!userinfo) return;
    const q = query(collection(db, 'logs'), where('uid', '==', userinfo.uid));
    const unsubscribe = onSnapshot(q, async (docSnapshot) => {
      const records = [];
      for (const doc of docSnapshot.docs) {
        const feelings = [];
        for (const feeling of doc.data().feelings) {
          feelings.push((await getDoc(feeling)).data());
        }
        const record = {
          feelings,
        };

        records.push(record);
      }
      setRawData(records);
    });

    return unsubscribe;
  }, [userinfo]);

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
