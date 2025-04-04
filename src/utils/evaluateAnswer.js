export default function evaluateAnswer(
  userAnswer,
  correctAnswer,
  typoTolerance = 0.8
) {
  // Handle null or undefined inputs
  if (!userAnswer || !correctAnswer) {
    return false;
  }

  // Convert to strings if they aren't already
  userAnswer = String(userAnswer).trim();
  correctAnswer = String(correctAnswer).trim();

  // Empty answers
  if (userAnswer === '' || correctAnswer === '') {
    return userAnswer === correctAnswer;
  }

  // Normalize strings: lowercase and remove accents
  const normalizeString = (str) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Remove diacritical marks
  };

  const normalizedUserAnswer = normalizeString(userAnswer);
  const normalizedCorrectAnswer = normalizeString(correctAnswer);

  // Exact match after normalization
  if (normalizedUserAnswer === normalizedCorrectAnswer) {
    return true;
  }

  // Calculate Levenshtein distance for typo tolerance
  function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    // Initialize matrix
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    // Fill in the matrix
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        const cost = a[j - 1] === b[i - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }

    return matrix[b.length][a.length];
  }

  const distance = levenshteinDistance(
    normalizedUserAnswer,
    normalizedCorrectAnswer
  );

  // Calculate similarity ratio (1.0 means perfect match)
  const maxLength = Math.max(
    normalizedUserAnswer.length,
    normalizedCorrectAnswer.length
  );
  const similarityRatio =
    maxLength === 0 ? 1.0 : (maxLength - distance) / maxLength;

  // Return true if similarity is above the tolerance threshold
  return similarityRatio >= typoTolerance;
}
