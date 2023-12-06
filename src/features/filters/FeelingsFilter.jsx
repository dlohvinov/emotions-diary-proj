import { Box, Chip, Typography, useTheme } from '@mui/joy';
import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import FeelingsAutocomplete from '../feelings/FeelingsAutocomplete.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { updateFilter } from '../history/historySlice.js';
import { selectCountedFeelings } from '../history/historySlice.js';

function FeelingsFilter() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { t } = useTranslation();

  const value = useSelector((state) => state.history.filters.feelings);
  const topFeelings = useSelector((state) => selectCountedFeelings(state, 5));
  const topFeelingsArray = useMemo(() => [...topFeelings.entries()], [topFeelings])

  const onValueChange = (e, value) => dispatch(updateFilter({ filter: 'feelings', value }));

  return (
    <Fragment>
      <Box component="section">
        <FeelingsAutocomplete
          value={value}
          onChange={onValueChange}
        />
        <Typography>
          {t('reusable.quickFilters')}
        </Typography>
        {topFeelingsArray.map(([feeling, count]) => (
          <Chip
            variant="solid"
            key={feeling.id}
            onClick={() => !value.includes(feeling) && onValueChange(null, value.concat(feeling))}
          >{feeling.label} / {count}</Chip>
        ))}
      </Box>
    </Fragment>
  );
}

export default FeelingsFilter;
