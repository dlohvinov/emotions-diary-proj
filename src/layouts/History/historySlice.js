import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApp } from 'firebase/app';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
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
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...doc.data(),
        feelings: data.feelings.map((feeling) => thunkAPI.getState().feelings.entities[feeling.id]),
        causes: data.causes.map((cause) => thunkAPI.getState().causes.entities[cause.id]),
        id: doc.id,
      };
    });
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
