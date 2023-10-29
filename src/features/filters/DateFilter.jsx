import { DateRangePicker } from '@tremor/react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFilter } from '../history/historySlice.js';

function DateFilter() {
  const dispatch = useDispatch();

  const value = useSelector((state) => state.history.filters.date);
  const onValueChange = (value) => dispatch(updateFilter({ filter: 'date', value }));

  return (
    <DateRangePicker
      value={value}
      onValueChange={onValueChange}
    />
  );
}

export default DateFilter;
