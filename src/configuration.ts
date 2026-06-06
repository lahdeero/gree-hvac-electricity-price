import settings from './settings.json';
import { Settings } from './types/types';

export const getSettings = (): Settings => {
  return settings as Settings;
};
