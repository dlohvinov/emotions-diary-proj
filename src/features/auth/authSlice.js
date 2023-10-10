import { createSlice } from '@reduxjs/toolkit';
import { getAuth } from 'firebase/auth';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    auth: null,
    user: null,
  },
  reducers: {
    setAuth: (state, action) => {
      state.auth = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setAuth, setUser } = authSlice.actions;

export const initializeAuth = () => (dispatch) => {
  const auth = getAuth();
  dispatch(setAuth(auth));
  auth.onAuthStateChanged((user) => {
    if (user) {
      dispatch(setUser(user));
    } else {
      dispatch(setUser(null));
    }
  });
  return auth;
};

export const authSelector = (state) => state.auth.auth;
export const userinfoSelector = (state) => state.auth.auth?.currentUser && {
  displayName: state.auth.auth.currentUser.displayName,
  email: state.auth.auth.currentUser.email,
  emailVerified: state.auth.auth.currentUser.emailVerified,
  photoURL: state.auth.auth.currentUser.photoURL,


  // The user's ID, unique to the Firebase project. Do NOT use
  // this value to authenticate with your backend server, if
  // you have one. Use User.getToken() instead.
  uid: state.auth.auth.currentUser.uid,
};

export default authSlice.reducer;
