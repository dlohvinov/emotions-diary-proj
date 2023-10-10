import { Box, IconButton } from '@mui/joy';
import PropTypes from 'prop-types';
import { Edit, Delete } from '@mui/icons-material';
import EmotionPopup from '../emotion-popup/EmotionPopup.jsx';

function HistoryRecord({ record, onEdit, onDelete }) {
  return (
    <Box component="article">
      <Box component="header">{record.emotion}</Box>
      <Box component="section">
        {record.cause.map((cause) => (
          <Box key={cause}>{cause}</Box>
        ))}
      </Box>
      <Box component="p">{record.description}</Box>
      <Box component="footer">
        {new Date().toLocaleString()}
        <EmotionPopup
          activator={
            <IconButton variant="plain">
              <Edit></Edit>
            </IconButton>
          }
          record={record}
          onSave={() => onEdit(record)}
        ></EmotionPopup>
        <IconButton
          variant="plain"
          onClick={() => onDelete(record)}
        >
          <Delete></Delete>
        </IconButton>
      </Box>
    </Box>
  );
}

HistoryRecord.propTypes = {
  record: PropTypes.shape({
    emotion: PropTypes.string.isRequired,
    cause: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default HistoryRecord;
