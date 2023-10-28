import {
  Autocomplete,
  FormControl,
  FormLabel,
  FormHelperText,
} from '@mui/joy';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { selectAllFeelings } from './feelingsSlice.js';

function FeelingsAutocomplete({
                                value,
                                error = false,
                                onChange,
                              }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const feelingsList = useSelector(selectAllFeelings);

  return (
    <FormControl error={error}>
      <FormLabel>{t('feelings.feeling')}</FormLabel>
      <Autocomplete
        value={value}
        options={feelingsList}
        placeholder={t('feelings.feeling')}
        getOptionLabel={(option) => option.name}
        disableCloseOnSelect
        multiple
        onChange={onChange}
      />
      <FormHelperText>{t('validation.required')}</FormHelperText>
    </FormControl>
  );
}

FeelingsAutocomplete.propTypes = {
  value: PropTypes.array.isRequired,
  error: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default FeelingsAutocomplete;
