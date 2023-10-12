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
} from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { instanceSelector } from '../firebase/firebaseSlice.js';
import HistoryRecord from './HistoryRecord.jsx';
import { userinfoSelector } from '../auth/authSlice.js';
import EmotionPopup from '../emotion-popup/EmotionPopup.jsx';

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
    const q = query(collection(db, 'emotions'), where('uid', '==', userinfo.uid));
    const unsubscribe = onSnapshot(q, (docSnapshot) => {
      setRecords(docSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })));
    });
    return unsubscribe;
  }, [userinfo]);

  async function deleteRecord(record) {
    await deleteDoc(doc(db, 'emotions', record.id));
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
        p: 1,
      }}
    >
      <EmotionPopup
        activator={!!reviewedRecord}
        record={reviewedRecord}
        mode={reviewedRecordMode}
        onClose={handleEmotionPopupClose}
      ></EmotionPopup>
      <Box component="header">
        Searchbar goes here
        Then go most common emotions | causes
      </Box>
      <Box
        component="section" sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
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
