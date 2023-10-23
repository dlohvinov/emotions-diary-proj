import { extendTheme } from '@mui/joy/styles';
import { useDispatch } from 'react-redux';
import { CssVarsProvider } from '@mui/joy';
// import Auth from '../pages/AuthPage/Auth.jsx';
import MainPage from '../pages/MainPage/MainPage.jsx';
import { initializeAuth } from '../features/auth/authSlice.js';
import { fetchHistory } from '../layouts/History/historySlice.js';

function App() {
  const dispatch = useDispatch();

  const initializeApp = async () => {
    await dispatch(initializeAuth()).unwrap();
    return dispatch(fetchHistory()).unwrap();
  }
  initializeApp();

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
