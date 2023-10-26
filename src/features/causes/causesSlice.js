import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApp } from 'firebase/app';
import { collection, getDocs, getFirestore, query } from 'firebase/firestore';
import LoadingStatus from '../../app/enums/LoadingStatus.enum.js';

export const fetchCauses = createAsyncThunk(
  'causes/fetchCauses',
  async () => {
    const app = getApp();
    const db = getFirestore(app);
    const causesQ = query(collection(db, 'causes'));
    const snapshot = await getDocs(causesQ);
    const causes = [];
    snapshot.forEach((doc) => causes.push({
      ...doc.data(),
      id: doc.id,
    }));
    return causes;
  },
);

export const causesSlice = createSlice({
  name: 'causes',
  initialState: {
    loading: LoadingStatus.IDLE,
    causes: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCauses.fulfilled, (state, action) => {
      state.causes = action.payload;
      state.loading = LoadingStatus.IDLE;
    });
    builder.addCase(fetchCauses.rejected, (state, action) => {
      console.log(action.error);
      state.loading = LoadingStatus.IDLE;
    });
    builder.addCase(fetchCauses.pending, (state) => {
      state.loading = LoadingStatus.PENDING;
    });
  },
});

export default causesSlice.reducer;
