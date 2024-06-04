import * as R from 'remeda';

const CHANGE_HOUR_WEEEKEND = 1;
const CHANGE_HOUR_WEEK = 0;

const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
};

export const isNightTime = (date: Date): boolean => {
  const hour = date.getHours();
  if (isWeekend(date)) {
    return hour >= 1 && hour < 10;
  }
  return hour >= 0 && hour < 8;
};

export const isChangeHour = (date: Date) => {
  const hour = date.getHours();
  if (isWeekend(date)) {
    return hour === CHANGE_HOUR_WEEEKEND;
  }
  return hour === CHANGE_HOUR_WEEK;
};

export const hasChanged = <T> (data: T, compare: T): boolean =>  {
  return !R.isDeepEqual(data, compare);
};
