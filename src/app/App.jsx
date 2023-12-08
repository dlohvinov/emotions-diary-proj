import { CssVarsProvider } from '@mui/joy';
import { extendTheme } from '@mui/joy/styles';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAuth, selectUID } from '../features/auth/authSlice.js';
import { fetchCauses } from '../features/causes/causesSlice.js';
import { fetchFeelings } from '../features/feelings/feelingsSlice.js';
import { fetchHistory } from '../features/history/historySlice.js';
// import Auth from '../pages/AuthPage/Auth.jsx';
import MainPage from '../pages/MainPage/MainPage.jsx';

function App() {
  const dispatch = useDispatch();

  const uid = useSelector(selectUID);

  const initializeApp = async () => {

    if (!uid) await dispatch(initializeAuth()).unwrap();
    else {
      await Promise.allSettled([
        dispatch(fetchFeelings()).unwrap(),
        await dispatch(fetchCauses()).unwrap(),
      ]);
      return dispatch(fetchHistory()).unwrap();
    }
  };

  useEffect(() => {
    initializeApp();
  }, [uid]);

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
