import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import firebaseReducer from '../features/firebase/firebaseSlice.js';

export default configureStore({
  reducer: {
    auth: authReducer,
    firebase: firebaseReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
    // serializableCheck: {
    //   ignoredActionPaths: ['firebase'],
    //   ignoredPaths: ['firebase'],
    // },
  }),
});
