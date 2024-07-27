import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  NextOrObserver,
  User,
} from 'firebase/auth';

import firebase from './config';

const auth = getAuth(firebase);

export const signInUser = async (email: string, password: string) => {
  if (email && password) {
    return await signInWithEmailAndPassword(auth, email, password);
  }
};

export const userStateListener = (callback: NextOrObserver<User>) => {
  return onAuthStateChanged(auth, callback);
};

export const SignOutUser = async () => await signOut(auth);
