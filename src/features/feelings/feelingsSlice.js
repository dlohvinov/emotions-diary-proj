import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
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

const feelingsAdapter = createEntityAdapter({
  selectId: (feeling) => feeling.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});


export const feelingsSlice = createSlice({
  name: 'feelings',
  initialState: feelingsAdapter.getInitialState({
    loading: LoadingStatus.IDLE,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFeelings.fulfilled, (state, action) => {
      feelingsAdapter.addMany(state, action.payload);
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

const getFeelingsSelectors = feelingsAdapter.getSelectors(
  (state) => state.feelings,
);

export const {
  selectAll: selectAllFeelings,
  selectById: selectFeelingById,
} = getFeelingsSelectors;

export default feelingsSlice.reducer;
