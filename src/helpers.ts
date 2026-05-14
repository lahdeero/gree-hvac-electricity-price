import { getConfiguration } from "./configuration";

const config = getConfiguration();

const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
};

export const isNightTime = (date: Date): boolean => {
  const hour = date.getHours();
  if (isWeekend(date)) {
    return hour >= 1 && hour < config.day_change_hour_weekend;
  }
  return hour >= 0 && hour < config.day_change_hour_week;
};

export const isChangeHour = (date: Date) => {
  const hour = date.getHours();
  if (isWeekend(date)) {
    return [config.day_change_hour_weekend, config.night_change_hour_weekend].includes(
      hour
    );
  }
  return [config.day_change_hour_week, config.night_change_hour_week].includes(hour);
};
