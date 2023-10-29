import FeelingsAutocomplete from '../feelings/FeelingsAutocomplete.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { updateFilter } from '../history/historySlice.js';

function FeelingsFilter() {
  const dispatch = useDispatch();

  const value = useSelector((state) => state.history.filters.feelings);
  const onValueChange = (e, value) => dispatch(updateFilter({ filter: 'feelings', value }));

  return (
    <FeelingsAutocomplete
      value={value}
      onChange={onValueChange}
    />
  );
}

export default FeelingsFilter;
