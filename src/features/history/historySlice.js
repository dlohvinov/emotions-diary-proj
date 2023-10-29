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

    const filters = thunkAPI.getState().history.filters;

    let q = query(
      collection(db, 'logs'),
      where('uid', '==', uid),
      where('createdAt', '>=', new Date(filters.date.from).getTime()),
      where('createdAt', '<=', new Date(filters.date.to).getTime()),
      orderBy('createdAt', 'desc'),
    );
    if (filters.feelings.length) {
      q = query(q, where('feelings', 'array-contains-any', filters.feelings.map((feeling) => doc(db, 'feelings', feeling.id))));
    }
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
    filters: {
      feelings: [],
      date: {
        from: new Date(new Date().setDate(1)).getTime(),
        to: new Date().getTime(),
      },
    },
  },
  reducers: {
    onDateFilterChange: (state, action) => {
      state.filters.date = {
        from: action.payload.from.getTime(),
        to: action.payload.to.getTime(),
      };
    },
    onFeelingsFilterChange: (state, action) => {
      state.filters.feelings = action.payload;
    },
  },
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

export const { onDateFilterChange, onFeelingsFilterChange } = historySlice.actions;

export const updateFilter = ({ filter, value }) => (dispatch) => {
  switch (filter) {
    case 'date':
      dispatch(onDateFilterChange(value));
      break;
    case 'feelings':
      dispatch(onFeelingsFilterChange(value));
      break;
    default:
      throw new Error(`Unknown filter ${filter}`);
  }
  return dispatch(fetchHistory());
}

export default historySlice.reducer;
