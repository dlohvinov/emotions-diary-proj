// Import the functions you need from the SDKs you need
// import { auth as firebaseuiAuth } from 'firebaseui';
import { Button } from '@mui/joy';
// import 'firebaseui/dist/firebaseui.css';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useSelector } from 'react-redux';
import {
  authSelector,
  userinfoSelector,
} from './authSlice.js';
import AuthForm from './AuthForm.jsx';

function Auth() {
  const auth = useSelector(authSelector);
  const userinfo = useSelector(userinfoSelector);
  window.auth = auth;

 const sin = () => {
   signInWithPopup(auth, new GoogleAuthProvider())
   .then((result) => {
     // This gives you a Google Access Token. You can use it to access the Google API.
     const credential = GoogleAuthProvider.credentialFromResult(result);
     const token = credential.accessToken;
     // The signed-in user info.
     const user = result.user;
     // IdP data available using getAdditionalUserInfo(result)
     // ...
   }).catch((error) => {
     // Handle Errors here.
     const errorCode = error.code;
     const errorMessage = error.message;
     // The email of the user's account used.
     const email = error.customData.email;
     // The AuthCredential type that was used.
     const credential = GoogleAuthProvider.credentialFromError(error);
     // ...
   });
 }

  function signOut() {
    auth.signOut();
  }

  return (
    <div>
      <AuthForm></AuthForm>
      {!userinfo && <Button onClick={sin}>popup</Button>}
      <h1>Auth</h1>
      {/*{!userinfo && <div id="firebaseui-auth-container"></div>}*/}
      {userinfo && <Button onClick={signOut}>sign out</Button>}
      {userinfo && <img src={userinfo.photoURL} alt="photo pic" />}
      {userinfo && <pre>{JSON.stringify(userinfo, null, 2)}</pre>}
    </div>
  );
}

export default Auth;
