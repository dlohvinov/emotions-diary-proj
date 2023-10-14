import {
  Box,
  IconButton,
  Card,
  Typography,
  Chip,
  ButtonGroup,
  useTheme,
} from '@mui/joy';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Edit, Delete, Visibility } from '@mui/icons-material';

function HistoryRecord({
                         record,
                         onView,
                         onEdit,
                         onDelete,
                       }) {

  const theme = useTheme();

  const description = useMemo(() => {
    const maxSize = 180;
    return record.description.length < maxSize
      ? record.description
      : `${record.description.slice(0, maxSize)}...`;
  }, [record.description]);

  return (
    <Card
      component="article"
      variant="soft"
    >
      <Box
        component="header"
        sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}
      >
        {record.feelings.map((feeling) => (
          <Chip
            key={feeling.name}
            variant="solid"
            sx={{ bgcolor: theme.features.feelings }}
          >{feeling.name}</Chip>
        ))}
      </Box>
      <Box
        component="section"
        sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}
      >
        {record.causes.map((cause) => (
          <Chip
            key={cause.name}
            variant="solid"
            sx={{ bgcolor: theme.features.causes }}
          >{cause.name}</Chip>
        ))}
      </Box>
      <Typography
        level="body-md"
        component="p"
      >
        {description}
      </Typography>
      <Box
        component="footer"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography level="body-sm">
          {new Date(record.createdAt).toLocaleDateString()}
        </Typography>
        <ButtonGroup
          variant="soft"
          spacing={0.5}
        >
          <IconButton
            variant="soft"
            onClick={() => onView(record)}
          >
            <Visibility />
          </IconButton>
          <IconButton
            variant="soft"
            onClick={() => onEdit(record)}
          >
            <Edit />
          </IconButton>
          <IconButton
            variant="soft"
            onClick={() => onDelete(record)}
          >
            <Delete />
          </IconButton>
        </ButtonGroup>
      </Box>
    </Card>
  );
}

HistoryRecord.propTypes = {
  record: PropTypes.shape({
    feelings: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })).isRequired,
    causes: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })).isRequired,
    description: PropTypes.string,
    createdAt: PropTypes.number.isRequired,
  }).isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default HistoryRecord;
