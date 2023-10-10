import { createSlice } from '@reduxjs/toolkit';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const slice = createSlice({
  name: 'firebase',
  initialState: {
    instance: null,
    auth: null,
  },
  reducers: {
    setFirebaseInstance: (state, action) => {
      state.instance = action.payload;
    },
  }
});

export const { setFirebaseInstance } = slice.actions;

// Initialize Firebase
export const initializeFirebase = () => (dispatch) => {
  const app = initializeApp(firebaseConfig);
  dispatch(setFirebaseInstance(app));
  return app;
};

export const instanceSelector = (state) => state.firebase.instance;

export default slice.reducer;
