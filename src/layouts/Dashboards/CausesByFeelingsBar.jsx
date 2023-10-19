import { Card, Title, BarChart, Subtitle } from '@tremor/react';
import { Autocomplete } from '@mui/joy';
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
import { instanceSelector } from '../../features/firebase/firebaseSlice.js';

function CausesByFeelingsBar() {
  const { t } = useTranslation();

  const [records, setRecords] = useState([]);

  const userinfo = useSelector(selectUserinfo);
  const instance = useSelector(instanceSelector);
  const db = getFirestore(instance);

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
        const causes = [];
        for (const cause of doc.data().causes) {
          causes.push((await getDoc(cause)).data());
        }
        const record = {
          ...doc.data(),
          feelings,
          causes,
          id: doc.id,
        };

        records.push(record);
      }
      setRecords(records);
    });
    return unsubscribe;
  }, [userinfo]);

  const aggCausesByFeelings = useMemo(() => {
    const map = records.reduce((acc, cur) => {
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
  }, [records]);

  const existingCauses = useMemo(() => {
    const set = new Set();
    records.forEach((record) => {
      record.causes.forEach((cause) => {
        set.add(cause.name);
      });
    });
    return Array.from(set);
  }, [aggCausesByFeelings]);

  const existingFeelings = useMemo(() => {
    const set = new Set();
    records.forEach((record) => {
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
