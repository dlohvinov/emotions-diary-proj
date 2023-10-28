import { extendTheme } from '@mui/joy/styles';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CssVarsProvider } from '@mui/joy';
import { fetchCauses } from '../features/causes/causesSlice.js';
import { fetchFeelings } from '../features/feelings/feelingsSlice.js';
// import Auth from '../pages/AuthPage/Auth.jsx';
import MainPage from '../pages/MainPage/MainPage.jsx';
import { initializeAuth } from '../features/auth/authSlice.js';
import { subscribeToHistory } from '../layouts/History/historySlice.js';

function App() {
  const dispatch = useDispatch();

  const initializeApp = async () => {
    const user = await dispatch(initializeAuth()).unwrap();
    await Promise.allSettled([
      dispatch(fetchFeelings()).unwrap(),
      dispatch(fetchCauses()).unwrap(),
    ]);
    dispatch(subscribeToHistory(user));
  };

  useEffect(() => {
    initializeApp();
  }, []);

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
