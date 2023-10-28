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
  doc, onSnapshot,
} from 'firebase/firestore';
import LoadingStatus from '../../app/enums/LoadingStatus.enum.js';

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
  reducers: {
    onHistoryUpdate: (state, action) => {
      state.history = action.payload;
    },
  },
});

const { onHistoryUpdate } = historySlice.actions;

export const subscribeToHistory = (user) => (dispatch) => {
  const { uid } = user;
  const app = getApp();
  const db = getFirestore(app);
  const q = query(
    collection(db, 'logs'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc'),
  );
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const records = [];
    snapshot.forEach((doc) => {
      records.push({
        ...doc.data(),
        id: doc.id,
      });
    });
    dispatch(onHistoryUpdate(records));
  });
  return unsubscribe;
};

export default historySlice.reducer;
