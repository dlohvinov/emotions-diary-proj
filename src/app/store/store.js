import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice.js';

export default configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
  }),
});
