import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { getAuth } from 'firebase/auth';

export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async () => {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged((user) => {
        if (!user) return reject(null);

        // cannot set non-serializable user object so that we pick only needed properties
        resolve({
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
          uid: user.uid,
        });
      });
    });
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
  },
  extraReducers: (builder) => {
    builder.addCase(initializeAuth.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(initializeAuth.rejected, (state) => {
      state.user = null;
    });
  }
});

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
