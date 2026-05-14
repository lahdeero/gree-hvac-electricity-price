import settings from './settings.json';
import { Settings } from './types/types';

export const getConfiguration = (): Settings => {
  return settings as Settings;
};
