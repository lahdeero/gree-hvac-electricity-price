import * as R from 'remeda';

const NIGHT_CHANGE_HOUR_WEEEKEND = 1;
const NIGHT_CHANGE_HOUR_WEEK = 0;
const DAY_CHANGE_HOUR_WEEEKEND = 10;
const DAY_CHANGE_HOUR_WEEK = 8;

const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
};

export const isNightTime = (date: Date): boolean => {
  const hour = date.getHours();
  if (isWeekend(date)) {
    return hour >= 1 && hour < DAY_CHANGE_HOUR_WEEEKEND;
  }
  return hour >= 0 && hour < DAY_CHANGE_HOUR_WEEK;
};

export const isChangeHour = (date: Date) => {
  const hour = date.getHours();
  if (isWeekend(date)) {
    return [DAY_CHANGE_HOUR_WEEEKEND, NIGHT_CHANGE_HOUR_WEEEKEND].includes(hour);
  }
  return [DAY_CHANGE_HOUR_WEEK, NIGHT_CHANGE_HOUR_WEEK].includes(hour);
};

// Maybe remeda and this is not needed since cant change current values
export const hasChanged = <T> (data: T, compare: T): boolean =>  {
  return !R.isDeepEqual(data, compare);
};
