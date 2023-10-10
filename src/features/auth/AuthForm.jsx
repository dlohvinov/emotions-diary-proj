import { Input, Button } from '@mui/joy';
import { useTranslation } from 'react-i18next';

function AuthForm() {
  const { t } = useTranslation();

  return (
    <form className="p-4 w-6/12 bg-slate-300">
      <h2>{t('auth.title')}</h2>
      <Input placeholder={t('auth.email')}></Input>
      <Button>{t('auth.loginButton')}</Button>
    </form>
  );
}

export default AuthForm;
