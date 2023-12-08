import { DateRangePicker } from '@tremor/react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFilter } from '../history/historySlice.js';

function DateFilter() {
  const dispatch = useDispatch();

  const value = useSelector((state) => state.history.filters.date);
  const onValueChange = (value) => dispatch(updateFilter({ filter: 'date', value }));

  return (
    <DateRangePicker
      minDate={new Date(Date.now() - 1000 * 60 * 60 * 24 * 365)}
      value={value}
      onValueChange={onValueChange}
    />
  );
}

export default DateFilter;
