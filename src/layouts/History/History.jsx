import { Box, Chip } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteHistory } from './historySlice.js';
import HistoryRecord from './HistoryRecord.jsx';
import LogPopup from '../LogPopup/LogPopup.jsx';

function History() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const records = useSelector((state) => state.history.history);

  const [reviewedRecord, setReviewedRecord] = useState(null);

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
    await dispatch(deleteHistory(record)).unwrap();
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
