import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  NextOrObserver,
  User,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';
import { get } from './database.js';
import { firebase, userCreationInstance } from './config';

const APP_URL = import.meta.env.VITE_APP_BASE_URL;
const auth = getAuth(firebase);

export const signInUser = async (email: string, password: string) => {
  if (email && password) {
    return await signInWithEmailAndPassword(auth, email, password);
  }
};

export const sendLoginLink = async (email: string) => {
  const actionCodeSettings = {
    url: `${APP_URL}/confirmar-login`,
    handleCodeInApp: true,
  };

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
  } catch (e) {
    throw e;
  }
};

export const authenticateWithMagicLink = async () => {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem('emailForSignIn');

    if (!email) {
      throw new Error('NO_EMAIL_STORED');
    }

    try {
      const res = await signInWithEmailLink(auth, email, window.location.href);
      window.localStorage.removeItem('emailForSignIn');
      return res;
    } catch (e) {
      console.log(e);
    }
  }
};

export const userStateListener = (callback: NextOrObserver<User>) => {
  return onAuthStateChanged(auth, callback);
};

export const SignOutUser = async () => await signOut(auth);

export const getUserData = async (userCredential) => {
  const { uid } = userCredential;
  return await get(`user_data/${uid}`);
};

export const createUser = async (email: string) => {
  const secondAuth = getAuth(userCreationInstance);
  return await createUserWithEmailAndPassword(secondAuth, email, 'silente1');
};
