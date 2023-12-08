import { createAsyncThunk, createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { getApp } from 'firebase/app';
import { collection, getDocs, getFirestore, query } from 'firebase/firestore';
import i18n from 'i18next';
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
      label: i18n.t(`causes.list.${doc.data().name}`),
      id: doc.id,
    }));
    return causes;
  },
);

const causesAdapter = createEntityAdapter({
  selectId: (cause) => cause.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const causesSlice = createSlice({
  name: 'causes',
  initialState: causesAdapter.getInitialState({
    loading: LoadingStatus.IDLE,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCauses.fulfilled, (state, action) => {
      causesAdapter.addMany(state, action.payload);
      state.loading = LoadingStatus.IDLE;
    });
    builder.addCase(fetchCauses.rejected, (state, action) => {
      state.loading = LoadingStatus.IDLE;
    });
    builder.addCase(fetchCauses.pending, (state) => {
      state.loading = LoadingStatus.PENDING;
    });
  },
});

const getCausesSelectors = causesAdapter.getSelectors(
  (state) => state.causes,
);

export const {
  selectAll: selectAllCauses,
  selectById: selectCauseById,
} = getCausesSelectors;

export default causesSlice.reducer;
