export const MODES = {
  LEARN: 'learn',
  // PRACTICE: 'practice',
  // TEST: 'test',
  // RESOURCES: 'resources',
};

export const MODE_LABELS = {
  [MODES.LEARN]: {
    shortName: 'Aprender',
    name: 'Aprender Vocabulario',
    emoji: '📚',
    enabled: true,
  },
  [MODES.PRACTICE]: {
    shortName: 'Practicar',
    name: 'Practicar Vocabulario',
    emoji: '💡',
    enabled: false,
  },
  [MODES.TEST]: {
    shortName: 'Examen',
    name: 'Examen de Vocabulario',
    emoji: '❓',
    enabled: false,
  },
  [MODES.RESOURCES]: {
    shortName: 'Recursos',
    name: 'Recursos',
    emoji: '✏️',
    enabled: false,
  },
};
