import {
  Box,
  Button,
  IconButton,
  Card,
  Typography,
  Chip,
  ButtonGroup,
  useTheme,
} from '@mui/joy';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Delete } from '@mui/icons-material';

function HistoryRecord({
                         record,
                         onEdit,
                         onDelete,
                       }) {

  const { t } = useTranslation();
  const theme = useTheme();

  const [showFull, setShowFull] = useState(false);

  const maxSize = 180;
  const isDescriptionOverflow = record.description.length > maxSize;

  const description = useMemo(() => {
    return (!isDescriptionOverflow || showFull)
      ? record.description
      : `${record.description.slice(0, maxSize)}...`;
  }, [showFull]);

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
      {
        isDescriptionOverflow &&
        <Button
          variant="plain"
          width="100%"
          onClick={() => setShowFull(!showFull)}
        >
          {showFull ? t('les') : t('morr')}
        </Button>
      }
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
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default HistoryRecord;
