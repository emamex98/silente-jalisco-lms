import { getDatabase, ref, set, get as _get } from 'firebase/database';
import { firebase } from './config';

const db = getDatabase(firebase);

export const post = async (entryPath: string, value: unknown) => {
  const entryRef = ref(db, entryPath);
  try {
    const snapshot = await set(entryRef, value);
    return snapshot;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const get = async (entryPath: string) => {
  const entryRef = ref(db, entryPath);
  try {
    const snapshot = await _get(entryRef);
    return snapshot.exists() ? snapshot.val() : undefined;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
