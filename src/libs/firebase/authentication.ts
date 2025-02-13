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

const auth = getAuth(firebase);

export const signInUser = async (email: string, password: string) => {
  if (email && password) {
    return await signInWithEmailAndPassword(auth, email, password);
  }
};

// export const sendLoginLink = async (email: string) => {
//   const actionCodeSettings = {
//     // URL you want to redirect back to. The domain (www.example.com) for this
//     // URL must be in the authorized domains list in the Firebase Console.
//     url: 'http://localhost:5173/test',
//     // This must be true.
//     handleCodeInApp: true,
//   };

//   try {
//     await sendSignInLinkToEmail(auth, email, actionCodeSettings);
//     window.localStorage.setItem('emailForSignIn', email);
//   } catch (e) {
//     console.log(e);
//   }
// };

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
