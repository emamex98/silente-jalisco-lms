// Service for lesson-related Firebase operations
import { get, post, remove } from '@libs/firebase/database';
import { deleteFolder } from '@libs/firebase/storage';

/**
 * Deletes a lesson from Firebase Realtime Database and its associated folder from Storage.
 * @param {string} path - The path to the lesson (e.g., /lecciones/levelKey/lessonKey).
 * @returns {Promise<void>}
 */
export const deleteLesson = async (path) => {
  try {
    await remove(path.replace('/lecciones/', '/lessons/'));
    await deleteFolder(path.replace('/lecciones', ''));
  } catch (e) {
    console.error('Error deleting lesson:', e);
    throw e; // Re-throw the error to be caught by the caller
  }
};

/**
 * Toggles the visibility of a lesson in Firebase Realtime Database.
 * @param {string} path - The path to the lesson (e.g., /lecciones/levelKey/lessonKey).
 * @param {boolean} currentIsVisible - The current visibility state of the lesson.
 * @returns {Promise<void>}
 */
export const toggleLessonVisibility = async (path, currentIsVisible) => {
  try {
    const lessonVisibilityPath = `${path.replace('/lecciones/', '/lessons/')}/isVisible`;
    await post(lessonVisibilityPath, !currentIsVisible);
  } catch (e) {
    console.error('Error toggling lesson visibility:', e);
    throw e; // Re-throw the error to be caught by the caller
  }
};

/**
 * Fetches and formats all lessons from Firebase Realtime Database.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of formatted lesson objects.
 */
export const getFormattedLessons = async () => {
  try {
    const response = await get('lessons/');
    if (!response) {
      return [];
    }

    const mappedLessons = [];
    Object.keys(response).forEach((levelKey) => {
      const level = response[levelKey];
      if (level && typeof level === 'object') { // Check if level is an object
        Object.keys(level).forEach((lessonKey) => {
          // Ensure the lesson itself is an object and has the expected properties
          if (level[lessonKey] && typeof level[lessonKey] === 'object') {
            mappedLessons.push({
              name: level[lessonKey].styledName || 'N/A',
              level: level[lessonKey].styledLevel || 'N/A',
              key: `${levelKey}-${lessonKey}`,
              path: `/lecciones/${levelKey}/${lessonKey}`, // Add path for actions
              isVisible: !!level[lessonKey].isVisible, // Ensure boolean
              // rawData: level[lessonKey] // keep raw data if needed elsewhere
            });
          }
        });
      }
    });
    return mappedLessons;
  } catch (e) {
    console.error('Error fetching and formatting lessons:', e);
    throw e; // Re-throw the error to be caught by the caller
  }
};
