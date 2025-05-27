// Service for student-related Firebase operations
import { get, post, remove } from '@libs/firebase/database';
import { createUser } from '@libs/firebase/authentication';

/**
 * Fetches and formats all student data from Firebase Realtime Database.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of student objects.
 */
export const getFormattedStudents = async () => {
  try {
    const response = await get('user_data/');
    if (!response) {
      return [];
    }

    const mappedStudents = [];
    Object.keys(response).forEach((userId) => {
      const user = response[userId];
      if (user.role === 'student') {
        mappedStudents.push({
          id: userId, // Keep the original user ID
          // key: userId, // The 'key' for Table component is usually added in the component itself
          ...user, // Spread the rest of the user data
          // level: user.level.toUpperCase(), // Formatting like this can be done in component or here
          // status: user.active, // Raw status, Tag creation in component
        });
      }
    });
    return mappedStudents;
  } catch (e) {
    console.error('Error fetching and formatting students:', e);
    throw e; // Re-throw the error to be caught by the caller
  }
};

/**
 * Creates a new student user and stores their data.
 * @param {Object} studentData - The student data including email, password, and other details.
 * @returns {Promise<void>}
 */
export const createStudent = async (studentData) => {
  const { email, password, ...restOfStudentData } = studentData;
  try {
    const userCredential = await createUser(email, password);
    const userId = userCredential.user.uid;
    await post(`user_data/${userId}`, {
      ...restOfStudentData,
      email, // Store email with other data
      role: 'student', // Ensure role is set
      active: true, // Default to active
      id: userId, // Store id along with other data
    });
  } catch (e) {
    console.error('Error creating student:', e);
    throw e;
  }
};

/**
 * Updates an existing student's data.
 * @param {string} userId - The ID of the student to update.
 * @param {Object} studentData - The data to update.
 * @returns {Promise<void>}
 */
export const updateStudent = async (userId, studentData) => {
  try {
    // Make sure not to overwrite role or id if they are not meant to be changed here
    const { role, id, ...dataToUpdate } = studentData;
    await post(`user_data/${userId}`, dataToUpdate);
  } catch (e) {
    console.error('Error updating student:', e);
    throw e;
  }
};

/**
 * Deletes a student's data. Note: This does not delete the Firebase Auth user.
 * @param {string} userId - The ID of the student to delete.
 * @returns {Promise<void>}
 */
export const deleteStudent = async (userId) => {
  try {
    await remove(`user_data/${userId}`);
  } catch (e) {
    console.error('Error deleting student:', e);
    throw e;
  }
};
