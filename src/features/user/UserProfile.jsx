import { useSelector, useDispatch } from 'react-redux';
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
import { signOut } from '../auth/authSlice.js';
import { Logout, LoginSharp } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { selectUserinfo } from '../auth/authSlice.js';

function UserProfile() {
  const { t } = useTranslation();

  const userinfo = useSelector(selectUserinfo);

  const dispatch = useDispatch();

  function dispatchSignOut() {
    return dispatch(signOut());
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
        {/*<MenuItem*/}
        {/*  color="success"*/}
        {/*  // onClick={() => signIn()}*/}
        {/*>*/}
        {/*  <LoginSharp></LoginSharp>*/}
        {/*  {t('reusable.login')}*/}
        {/*</MenuItem>*/}
        <MenuItem
          color="danger"
          onClick={() => dispatchSignOut()}
        >
          <Logout></Logout>
          {t('reusable.logout')}
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default UserProfile;
