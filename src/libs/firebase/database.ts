import {
  getDatabase,
  ref,
  set,
  get as _get,
  remove as _remove,
} from 'firebase/database';
import { firebase } from './config';

const db = getDatabase(firebase);
const environment = import.meta.env.VITE_FIREBASE_ENVIRONMENT
  ? `${import.meta.env.VITE_FIREBASE_ENVIRONMENT}/`
  : '';

export const post = async (entryPath: string, value: unknown) => {
  const entryRef = ref(db, `${environment}${entryPath}`);
  try {
    const snapshot = await set(entryRef, value);
    return snapshot;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const get = async (entryPath: string) => {
  const entryRef = ref(db, `${environment}${entryPath}`);
  try {
    const snapshot = await _get(entryRef);
    return snapshot.exists() ? snapshot.val() : undefined;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const remove = async (entryPath: string) => {
  const entryRef = ref(db, `${environment}${entryPath}`);
  try {
    await _remove(entryRef);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
