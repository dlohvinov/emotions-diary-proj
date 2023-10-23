import { useSelector } from 'react-redux';
import {
  Avatar,
  Skeleton,
  Dropdown,
  Menu,
  MenuButton,
  MenuItem,
  ListDivider,
  Box,
  Typography,
} from '@mui/joy';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Logout, LoginSharp } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { selectUserinfo } from '../auth/authSlice.js';

function UserProfile() {
  const { t } = useTranslation();

  const userinfo = useSelector(selectUserinfo);

  function signIn() {
    return signInWithPopup(getAuth(), new GoogleAuthProvider());
  }

  return (
    <Dropdown>
      <MenuButton
        slots={{ root: Avatar }}
        slotProps={{
          root: {
            src: userinfo ? userinfo.photoURL : '',
            alt: userinfo ? userinfo.displayName : '',
          },
        }}
      >
        <Skeleton></Skeleton>
      </MenuButton>
      <Menu>
        <Box>
          <Typography>
            {userinfo && userinfo.displayName}
          </Typography>
        </Box>
        <Box>
          <Typography>
            {userinfo && userinfo.email}
          </Typography>
        </Box>
        <ListDivider></ListDivider>
        <MenuItem
          color="success"
          onClick={() => signIn()}
        >
          <LoginSharp></LoginSharp>
          {t('reusable.login')}
        </MenuItem>
        <MenuItem
          color="danger"
          onClick={() => auth.signOut()}
        >
          <Logout></Logout>
          {t('reusable.logout')}
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default UserProfile;
