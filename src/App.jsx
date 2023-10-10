import { useDispatch } from 'react-redux';
import Auth from './features/auth/Auth.jsx';
import MainPage from './features/main-page/MainPage.jsx';
import {
  initializeFirebase,
} from './features/firebase/firebaseSlice.js';
import { initializeAuth } from './features/auth/authSlice.js';

function App() {
  const dispatch = useDispatch();
  dispatch(initializeFirebase());
  dispatch(initializeAuth());

  return (
    <div>
      <MainPage></MainPage>
      <Auth></Auth>
    </div>
  );
}

export default App;
