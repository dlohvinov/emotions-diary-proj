import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice.js';
import historyReducer from '../../layouts/History/historySlice.js';

export default configureStore({
  reducer: {
    auth: authReducer,
    history: historyReducer,
  },
});
