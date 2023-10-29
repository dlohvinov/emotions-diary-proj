import {
  createAsyncThunk,
  createSelector,
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { getApp } from 'firebase/app';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  getFirestore,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import LoadingStatus from '../../app/enums/LoadingStatus.enum.js';

export const fetchHistory = createAsyncThunk(
  'history/fetchHistory',
  async (arg, thunkAPI) => {
    const app = getApp();
    const db = getFirestore(app);

    const { uid } = thunkAPI.getState().auth.user;
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

export const addHistory = createAsyncThunk(
  'history/addHistory',
  async ({ draft }, thunkAPI) => {
    const app = getApp();
    const db = getFirestore(app);
    const { uid } = thunkAPI.getState().auth.user;
    const createdAt = new Date().getTime();
    const resultRef = await addDoc(collection(db, 'logs'), {
      ...draft,
      feelings: draft.feelings.map((feeling) => doc(db, 'feelings', feeling.id)),
      causes: draft.causes.map((cause) => doc(db, 'causes', cause.id)),
      uid,
      createdAt,
    });
    const result = await getDoc(resultRef);
    const data = result.data();
    return {
      ...data,
      feelings: data.feelings.map((feeling) => thunkAPI.getState().feelings.entities[feeling.id]),
      causes: data.causes.map((cause) => thunkAPI.getState().causes.entities[cause.id]),
      id: result.id,
    };
  },
);

export const updateHistory = createAsyncThunk(
  'history/updateHistory',
  async ({ id, draft }, thunkAPI) => {
    const app = getApp();
    const db = getFirestore(app);
    const _draft = { ...draft };
    if (_draft.id) delete _draft.id;
    await updateDoc(doc(db, 'logs', id), {
      ..._draft,
      feelings: _draft.feelings.map((feeling) => doc(db, 'feelings', feeling.id)),
      causes: _draft.causes.map((cause) => doc(db, 'causes', cause.id)),
    });
    // updateDoc doesn't return ref to updated document :(
    const result = await getDoc(doc(db, 'logs', id));
    const data = result.data();
    return {
      ...data,
      feelings: data.feelings.map((feeling) => thunkAPI.getState().feelings.entities[feeling.id]),
      causes: data.causes.map((cause) => thunkAPI.getState().causes.entities[cause.id]),
      id: result.id,
    };
  },
);

export const deleteHistory = createAsyncThunk(
  'history/deleteHistory',
  async ({ id }, thunkAPI) => {
    const app = getApp();
    const db = getFirestore(app);
    await deleteDoc(doc(db, 'logs', id));
    await thunkAPI.dispatch(fetchHistory()).unwrap();
    return id;
  },
);

const historyAdapter = createEntityAdapter({
  selectId: (history) => history.id,
  sortComparer: (a, b) => b.createdAt - a.createdAt,
});

export const historySlice = createSlice({
  name: 'history',
  initialState: {
    ...historyAdapter.getInitialState(),
    loading: LoadingStatus.IDLE,
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
      historyAdapter.setAll(state, action.payload)
      state.loading = LoadingStatus.IDLE;
    });
    builder.addCase(fetchHistory.rejected, (state, action) => {
      console.log(action.error);
      state.loading = LoadingStatus.IDLE;
    });
    builder.addCase(fetchHistory.pending, (state) => {
      state.loading = LoadingStatus.PENDING;
    });
    builder.addCase(addHistory.fulfilled, (state, action) => {
      historyAdapter.addOne(state, action.payload);
    });
    builder.addCase(updateHistory.fulfilled, (state, action) => {
      historyAdapter.upsertOne(state, action.payload);
    });
  },
});

export const {
  onDateFilterChange,
  onFeelingsFilterChange,
} = historySlice.actions;

export const {
  selectAll: selectHistory,
  selectById: selectHistoryById,
  selectIds: selectHistoryIds,
} = historyAdapter.getSelectors((state) => state.history);

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
};

export const selectCountedFeelings = createSelector([
  selectHistory,
  (state, limit) => limit,
], (history, limit) => {
  const map = history.reduce((map, log) => {
    log.feelings.forEach((feeling) => {
      if (map.get(feeling)) {
        map.set(feeling, map.get(feeling) + 1);
      } else {
        map.set(feeling, 1);
      }
    });
    return map;
  }, new Map());
  const sortedMap = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
  return new Map([...sortedMap.entries()].slice(0, limit));
});

export default historySlice.reducer;
