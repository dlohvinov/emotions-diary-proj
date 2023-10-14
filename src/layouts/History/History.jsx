import { Box } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import {
  getFirestore,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  getDoc,
} from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { instanceSelector } from '../../features/firebase/firebaseSlice.js';
import HistoryRecord from './HistoryRecord.jsx';
import { userinfoSelector } from '../../features/auth/authSlice.js';
import LogPopup from '../../features/LogPopup/LogPopup.jsx';

function History() {
  const { t } = useTranslation();

  const [records, setRecords] = useState([]);
  const [reviewedRecord, setReviewedRecord] = useState(null);
  const [reviewedRecordMode, setReviewedRecordMode] = useState(null);

  const userinfo = useSelector(userinfoSelector);
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

  async function deleteRecord(record) {
    await deleteDoc(doc(db, 'logs', record.id));
  }

  function viewRecord(record) {
    setReviewedRecord(record);
    setReviewedRecordMode('view');
  }

  function editRecord(record) {
    setReviewedRecord(record);
    setReviewedRecordMode('edit');
  }

  function handleEmotionPopupClose() {
    setReviewedRecord(null);
    setReviewedRecordMode(null);
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
      }}
    >
      <LogPopup
        activator={!!reviewedRecord}
        record={reviewedRecord}
        mode={reviewedRecordMode}
        onClose={handleEmotionPopupClose}
      ></LogPopup>
      <Box component="header">
        Searchbar goes here
        Then go most common emotions | causes
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
            onView={viewRecord}
            onEdit={editRecord}
            onDelete={deleteRecord}
          ></HistoryRecord>
        ))}
      </Box>
    </Box>
  );
}

export default History;
