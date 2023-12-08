import { Modal, ModalDialog, Box, Typography, Button } from '@mui/joy';
import { signIn } from '../../features/auth/authSlice.js';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

export default function AuthPopup() {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  function dispatchSignIn() {
    dispatch(signIn());
  }

  return (
    <Modal
      open={true}
    >
      <ModalDialog
        sx={{ width: '30vw' }}
        color="neutral"
      >
        <Box
          component="section"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        ></Box>
        <Typography level="h1">
          {t('auth.title')}
        </Typography>
        <Typography level="p">
          {t('auth.description')}
        </Typography>
        <Button
          onClick={() => dispatchSignIn()}
        >
          {t('auth.authorize')}
        </Button>
      </ModalDialog>
    </Modal>
  );
}
