import { Box } from '@mui/joy';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import LogPopup from '../LogPopup/LogPopup.jsx';
import HistoryRecord from '../../features/history/HistoryRecord.jsx';
import {
  deleteHistory,
  fetchHistory, selectHistory,
} from '../../features/history/historySlice.js';
import FeelingsFilter from '../../features/filters/FeelingsFilter.jsx';

function History() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const records = useSelector(selectHistory);

  const [editedId, setEditedId] = useState(null);

  async function deleteRecord(record) {
    await dispatch(deleteHistory(record)).unwrap();
    return dispatch(fetchHistory()).unwrap();
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
        activator={!!editedId}
        editedId={editedId}
        onClose={() => setEditedId(null)}
      ></LogPopup>
      <Box component="header">
        <FeelingsFilter />
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
            onEdit={() => setEditedId(record.id)}
            onDelete={deleteRecord}
          ></HistoryRecord>
        ))}
      </Box>
    </Box>
  );
}

export default History;
