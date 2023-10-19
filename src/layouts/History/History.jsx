import { Box, Chip } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import { useEffect, useState, useMemo } from 'react';
import {
  getFirestore,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  getDoc,
  orderBy,
} from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { instanceSelector } from '../../features/firebase/firebaseSlice.js';
import HistoryRecord from './HistoryRecord.jsx';
import { selectUserinfo } from '../../features/auth/authSlice.js';
import LogPopup from '../LogPopup/LogPopup.jsx';

function History() {
  const { t } = useTranslation();

  const [records, setRecords] = useState([]);
  const [reviewedRecord, setReviewedRecord] = useState(null);

  const userinfo = useSelector(selectUserinfo);
  const instance = useSelector(instanceSelector);
  const db = getFirestore(instance);

  useEffect(() => {
    if (!userinfo) return;
    const q = query(collection(db, 'logs'), where('uid', '==', userinfo.uid), orderBy('createdAt', 'desc'));
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

  const countFeelings = useMemo(() => {
    return records.reduce((acc, cur) => {
      cur.feelings.forEach((feeling) => {
        if (acc[feeling.name]) {
          acc[feeling.name] += 1;
        } else {
          acc[feeling.name] = 1;
        }
      });
      return acc;
    }, {});
  }, [records]);

  const countCauses = useMemo(() => {
    return records.reduce((acc, cur) => {
      cur.causes.forEach((cause) => {
        if (acc[cause.name]) {
          acc[cause.name] += 1;
        } else {
          acc[cause.name] = 1;
        }
      });
      return acc;
    }, {});
  }, [records]);

  const existingCauses = useMemo(() => {
    return Object.keys(countCauses);
  }, [countCauses]);

  const top5Feelings = useMemo(() => {
    return Object.entries(countFeelings)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => (name));
  }, [countFeelings]);

  const top5Causes = useMemo(() => {
    return Object.entries(countCauses)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => (name));
  }, [countCauses]);

  async function deleteRecord(record) {
    await deleteDoc(doc(db, 'logs', record.id));
  }

  return (
    <Box
      component="section"
      sx={{
        height: '100%',
        minHeight: 0,
        bgcolor: 'background.surface',
        boxShadow: 'md',
        p: 2,
        overflowY: 'auto',
      }}
    >
      <LogPopup
        activator={!!reviewedRecord}
        record={reviewedRecord}
        onClose={() => setReviewedRecord(null)}
      ></LogPopup>
      <Box component="header">
        Searchbar goes here
        Then go most common emotions | causes
        <Box component="section">
          Most used feelings:
          {top5Feelings.map((feeling) => (
            <Chip key={feeling}>{feeling}</Chip>
          ))}
        </Box>
        <Box component="section">
          Most used causes:
          {top5Causes.map((cause) => (
            <Chip key={cause}>{cause}</Chip>
          ))}
        </Box>
      </Box>
      <Box
        component="section" sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
      >
        {records.map((record) => (
          <HistoryRecord
            key={record.id}
            record={record}
            onEdit={() => setReviewedRecord(record)}
            onDelete={deleteRecord}
          ></HistoryRecord>
        ))}
      </Box>
    </Box>
  );
}

export default History;
