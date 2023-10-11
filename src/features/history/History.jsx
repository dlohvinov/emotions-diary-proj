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

function History() {
  const { t } = useTranslation();

  const [records, setRecords] = useState([]);

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

  async function editRecord() {
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
      <Box component="header">
        Searchbar goes here
        Then go most common emotions | causes
      </Box>
      <Box component="section" sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}>
        {records.map((record) => (
          <HistoryRecord
            key={record.id}
            record={record}
            onDelete={deleteRecord}
            onEdit={editRecord}
          ></HistoryRecord>
        ))}
      </Box>
    </Box>
  );
}

export default History;
