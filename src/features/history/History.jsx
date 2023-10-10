import { Box } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { getFirestore, getDocs, collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { instanceSelector } from '../firebase/firebaseSlice.js';
import HistoryRecord from './HistoryRecord.jsx';

function History() {
  const { t } = useTranslation();

  const [records, setRecords] = useState([]);

  const instance = useSelector(instanceSelector);
  const db = getFirestore(instance);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'emotions'), (docSnapshot) => {
      setRecords(docSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })));
    });
    return unsubscribe;
  }, []);

  async function deleteRecord(record) {
    await deleteDoc(doc(db, 'emotions', record.id));
  }

  async function editRecord() {
  }

  return (
    <Box
      component="section"
      sx={{ bgcolor: 'background.tooltip', p: 1 }}
    >
      <Box component="header">
        Searchbar goes here
        Then go most common emotions | causes
      </Box>
      <Box component="section">
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
