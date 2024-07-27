import {
  getStorage,
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
} from 'firebase/storage';
import firebase from './config';

type FileObject = {
  file: File;
  name: string;
};

const storage = getStorage(firebase);

export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  try {
    const snapshot = await uploadBytes(storageRef, file);
    return snapshot;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const listFiles = async (path: string) => {
  const listRef = ref(storage, path);
  try {
    const files = await listAll(listRef);
    return files?.items;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getFileUrl = async (path: string) => {
  const filesRef = ref(storage, path);
  try {
    const url = await getDownloadURL(filesRef);
    return url;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const formatItemName = (name: string) =>
  name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .replace(/[áÁ]/g, 'a')
    .replace(/[éÉ]/g, 'e')
    .replace(/[íÍ]/g, 'i')
    .replace(/[óÓ]/g, 'o')
    .replace(/[úÚ]/g, 'u')
    .replace(/[ñÑ]/g, 'n')
    .toLowerCase();
