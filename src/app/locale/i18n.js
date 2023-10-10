import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uk from './uk/uk';

const resources = {
  uk: {
    translation: uk,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'uk',
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
