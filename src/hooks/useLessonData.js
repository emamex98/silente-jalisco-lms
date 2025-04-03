import { useState, useEffect, useCallback } from 'react';
import { get } from '@libs/firebase/database';
import { getFileUrl } from '@libs/firebase/storage';
import shuffleArray from '@utils/shuffleArray';
import { MODES } from '@utils/constants';

const errors = {
  NO_RESULTS_RETURNED: {
    title: 'Ocurrió un error al intentar cargar la lección que buscas.',
  },
  STORAGE_ERROR: {
    title: 'Ocurrió un error al cargar los recursos de la lección.',
  },
};

export function useLessonData(currentStep) {
  const [vocabulary, setVocabulary] = useState(null);
  const [vocabularyKeys, setVocabularyKeys] = useState(null);
  const [currentWord, setCurrentWord] = useState(null);
  const [error, setError] = useState(null);
  const [lessonDetails, setLessonDetails] = useState({
    name: '',
    level: '',
  });

  const fetchLessonDetails = useCallback(async (path, mode) => {
    setError(null);
    try {
      const response = await get(`lessons/${path}`);

      if (!response) {
        setError(errors.NO_RESULTS_RETURNED);
        return;
      }

      const { styledName, styledLevel, content } = response;
      setLessonDetails({ name: styledName, level: styledLevel });

      const mappedVideos = {};

      for (const key of Object.keys(content)) {
        const { id, meaning, path } = content[key];
        const src = await getFileUrl(path);
        mappedVideos[id] = { id, src, path, meaning };
      }

      setVocabulary(mappedVideos);

      if (mode === MODES.LEARN) {
        setVocabularyKeys(Object.keys(content));
      } else {
        setVocabularyKeys(shuffleArray(Object.keys(content)));
      }
    } catch (e) {
      console.error(e);
      setError({
        ...errors.STORAGE_ERROR,
        description: e.toString(),
      });
    }
  }, []);

  useEffect(() => {
    if (vocabulary && vocabularyKeys && currentStep > 0) {
      const index = currentStep - 1;
      if (index < vocabularyKeys.length) {
        setCurrentWord(vocabulary[vocabularyKeys[index]]);
      }
    }
  }, [currentStep, vocabulary, vocabularyKeys]);

  return {
    vocabulary,
    vocabularyKeys,
    currentWord,
    lessonDetails,
    error,
    fetchLessonDetails,
  };
}
