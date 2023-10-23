import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApp } from 'firebase/app';
import { collection, getDocs, getFirestore, query } from 'firebase/firestore';
import LoadingStatus from '../../app/enums/LoadingStatus.enum.js';

export const fetchFeelings = createAsyncThunk(
  'feelings/fetchFeelings',
  async () => {
    const app = getApp();
    const db = getFirestore(app);
    const feelingsQ = query(collection(db, 'feelings'));
    const snapshot = await getDocs(feelingsQ);
    const feelings = [];
    snapshot.forEach((doc) => feelings.push({
      ...doc.data(),
      id: doc.id,
    }));
    return feelings;
  },
);

export const feelingsSlice = createSlice({
  name: 'feelings',
  initialState: {
    loading: LoadingStatus.IDLE,
    feelings: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFeelings.fulfilled, (state, action) => {
      state.feelings = action.payload;
      state.loading = LoadingStatus.IDLE;
    });
    builder.addCase(fetchFeelings.rejected, (state, action) => {
      console.log(action.error);
      state.loading = LoadingStatus.IDLE;
    });
    builder.addCase(fetchFeelings.pending, (state) => {
      state.loading = LoadingStatus.PENDING;
    });
  },
});

export default feelingsSlice.reducer;
