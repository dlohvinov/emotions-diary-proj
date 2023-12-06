import {
  Autocomplete,
  FormControl,
  FormLabel,
  FormHelperText,
} from '@mui/joy';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchCauses, selectAllCauses } from './causesSlice.js';

function CausesAutocomplete({
                                value,
                                error = false,
                                onChange,
                              }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const causesList = useSelector(selectAllCauses);

  useEffect(() => {
    dispatch(fetchCauses());
  }, []);

  return (
    <FormControl error={error}>
      <FormLabel>{t('causes.cause')}</FormLabel>
      <Autocomplete
        value={value}
        options={causesList}
        placeholder={t('causes.cause')}
        getOptionLabel={(option) => option.label}
        disableCloseOnSelect
        multiple
        onChange={onChange}
      />
      <FormHelperText>{t('validation.required')}</FormHelperText>
    </FormControl>
  );
}

CausesAutocomplete.propTypes = {
  value: PropTypes.array.isRequired,
  error: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default CausesAutocomplete;
