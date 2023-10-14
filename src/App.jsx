import { createTheme } from '@mui/system';
import { useDispatch } from 'react-redux';
import { ThemeProvider } from '@mui/joy';
import Auth from './features/auth/Auth.jsx';
import MainPage from './pages/MainPage/MainPage.jsx';
import {
  initializeFirebase,
} from './features/firebase/firebaseSlice.js';
import { initializeAuth } from './features/auth/authSlice.js';

function App() {
  const dispatch = useDispatch();
  dispatch(initializeFirebase());
  dispatch(initializeAuth());

  /**
   * Don't know why, but injecting colors directly to palette doesn't work :(
   */
  const theme = createTheme({
    features: {
      feelings: '#FF6F59',
      causes: '#AB92BF',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <MainPage></MainPage>
      {/*<Auth></Auth>*/}
    </ThemeProvider>
  );
}

export default App;
