import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApp } from 'firebase/app';
import {
  collection,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import LoadingStatus from '../../app/enums/LoadingStatus.enum.js';

export const fetchHistory = createAsyncThunk(
  'history/fetchHistory',
  async (arg, thunkAPI) => {
    const { uid } = thunkAPI.getState().auth.user;
    const app = getApp();
    const db = getFirestore(app);
    const q = query(
      collection(db, 'logs'),
      where('uid', '==', uid),
      orderBy('createdAt', 'desc'),
    );
    const snapshot = await getDocs(q);
    const records = [];
    for (const doc of snapshot.docs) {
      const feelings = [];
      for (const feeling of doc.data().feelings) {
        feelings.push((await getDoc(feeling)).data());
      }
      const causes = [];
      for (const cause of doc.data().causes) {
        causes.push((await getDoc(cause)).data());
      }
      const record = {
        ...doc.data(),
        feelings,
        causes,
        id: doc.id,
      };

      records.push(record);
    }
    return records;
  },
);

export const deleteHistory = createAsyncThunk(
  'history/deleteHistory',
  async ({ id }) => {
    const app = getApp();
    const db = getFirestore(app);
    await deleteDoc(doc(db, 'logs', id));
    return id;
  },
);

export const historySlice = createSlice({
  name: 'history',
  initialState: {
    loading: LoadingStatus.IDLE,
    history: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchHistory.fulfilled, (state, action) => {
      state.history = action.payload;
      state.loading = LoadingStatus.IDLE;
    });
    builder.addCase(fetchHistory.rejected, (state, action) => {
      console.log(action.error);
      state.loading = LoadingStatus.IDLE;
    });
    builder.addCase(fetchHistory.pending, (state) => {
      state.loading = LoadingStatus.PENDING;
    });
  },
});

export default historySlice.reducer;
