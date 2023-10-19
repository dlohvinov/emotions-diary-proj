import { extendTheme } from '@mui/joy/styles';
import { useDispatch } from 'react-redux';
import { CssVarsProvider } from '@mui/joy';
import Auth from '../pages/AuthPage/Auth.jsx';
import MainPage from '../pages/MainPage/MainPage.jsx';
import {
  initializeFirebase,
} from './features/firebase/firebaseSlice.js';
import { initializeAuth } from '../features/auth/authSlice.js';

function App() {
  const dispatch = useDispatch();
  dispatch(initializeFirebase());
  dispatch(initializeAuth());

  // const { mode, setMode } = useColorScheme();
  // setMode('dark');

  /**
   * Don't know why, but injecting colors directly to palette doesn't work :(
   */
  const theme = extendTheme({
    features: {
      feelings: '#FF6F59',
      causes: '#AB92BF',
    },
  });

  return (
    <CssVarsProvider theme={theme}>
      <MainPage></MainPage>
      {/*<Auth></Auth>*/}
    </CssVarsProvider>
  );
}

export default App;
