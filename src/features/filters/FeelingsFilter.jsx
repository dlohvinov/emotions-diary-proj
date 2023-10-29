import { Box, Chip, useTheme } from '@mui/joy';
import { Fragment, useMemo } from 'react';
import FeelingsAutocomplete from '../feelings/FeelingsAutocomplete.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { updateFilter } from '../history/historySlice.js';
import { selectCountedFeelings } from '../history/historySlice.js';

function FeelingsFilter() {
  const dispatch = useDispatch();
  const theme = useTheme();

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
        {topFeelingsArray.map(([feeling, count]) => (
          <Chip
            variant="solid"
            key={feeling.id}
            onClick={() => !value.includes(feeling) && onValueChange(null, value.concat(feeling))}
          >{feeling.name} / {count}</Chip>
        ))}
      </Box>
    </Fragment>
  );
}

export default FeelingsFilter;
