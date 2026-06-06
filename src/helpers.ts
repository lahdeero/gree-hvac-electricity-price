import { getConfiguration } from "./configuration";

const config = getConfiguration();

const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
};

export const isNightTime = (date: Date): boolean => {
  const hour = date.getHours();
  return hour >= config.night_time_starts_at || hour < config.day_time_starts_at;
};

export const isChangeHour = (date: Date) => {
  const hour = date.getHours();
  if (isWeekend(date)) {
    return config.weekend_change_hours.includes(
      hour
    );
  }
  return config.weekday_change_hours.includes(hour);
};
