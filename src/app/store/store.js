import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice.js';
import historyReducer from '../../layouts/History/historySlice.js';
import feelingsSlice from '../../features/feelings/feelingsSlice.js';
import causesSlice from '../../features/causes/causesSlice.js';

export default configureStore({
  reducer: {
    auth: authReducer,
    history: historyReducer,
    feelings: feelingsSlice,
    causes: causesSlice,
  },
});
