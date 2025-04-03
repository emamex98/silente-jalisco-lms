export const LEVELS = [
  { value: 'a1-m1', label: 'Nivel A1 - Modulo 1' },
  { value: 'a1-m2', label: 'Nivel A1 - Modulo 2' },
  { value: 'a2-m1', label: 'Nivel A2 - Modulo 1' },
  { value: 'a2-m2', label: 'Nivel A2 - Modulo 2' },
  { value: 'b1-m1', label: 'Nivel B1 - Modulo 1' },
  { value: 'b1-m2', label: 'Nivel B1 - Modulo 2' },
  { value: 'c1-m1', label: 'Nivel C1 - Modulo 1' },
  { value: 'c1-m2', label: 'Nivel C1 - Modulo 2' },
  { value: 'c2-m1', label: 'Nivel C2 - Modulo 1' },
  { value: 'c2-m2', label: 'Nivel C2 - Modulo 2' },
];

export const USER_ACTIONS = {
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
};

export const MODES = {
  LEARN: 'learn',
  PRACTICE: 'practice',
  // TEST: 'test',
  // RESOURCES: 'resources',
};

export const MODE_MAPPER = {
  aprender: MODES.LEARN,
  practicar: MODES.PRACTICE,
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
    enabled: true,
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
