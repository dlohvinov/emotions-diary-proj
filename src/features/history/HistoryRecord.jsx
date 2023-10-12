import {
  Box,
  IconButton,
  Card,
  Typography,
  Chip,
  ButtonGroup,
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
      <Box component="header">
        <Typography level="title-md">
          {record.emotion}
        </Typography>
      </Box>
      <Box component="section" sx={{ display: 'flex', gap: 0.5 }}>
        {record.cause.map((cause) => (
          <Chip
            key={cause}
            color="primary"
            variant="solid"
          >{cause}</Chip>
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
    emotion: PropTypes.string.isRequired,
    cause: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default HistoryRecord;
