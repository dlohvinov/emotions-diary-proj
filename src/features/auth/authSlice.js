import { createSlice, createSelector } from '@reduxjs/toolkit';
import { getAuth } from 'firebase/auth';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
  },
  reducers: {
    onAuthStateChanged: (state, user) => {
      state.user = user;
    },
  },
});

export const { onAuthStateChanged } = authSlice.actions;

export const initializeAuth = () => (dispatch) => {
  const auth = getAuth();
  auth.onAuthStateChanged((user) => dispatch(onAuthStateChanged(user)));
};

// The user's ID, unique to the Firebase project. Do NOT use
// this value to authenticate with your backend server, if
// you have one. Use User.getToken() instead.
export const selectUID = createSelector(
  [(state) => state.auth.user],
  (user) => user && user.uid,
);

export const selectUserinfo = createSelector(
  [(state) => state.auth.user, selectUID],
  (user, uid) => user && {
    displayName: user.displayName,
    email: user.email,
    emailVerified: user.emailVerified,
    photoURL: user.photoURL,
    uid,
  },
);

export default authSlice.reducer;
