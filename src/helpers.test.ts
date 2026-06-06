import { describe, test, expect, vi } from "vitest";
import { isNightTime, isChangeHour } from "./helpers";
import { Settings } from "./types/types";

vi.mock("./configuration", () => ({
  getConfiguration: () => ({
    night_time_starts_at: 22,
    day_time_starts_at: 6,
    weekend_change_hours: [0, 1],
    weekday_change_hours: [23, 0],
  } satisfies Partial<Settings>),
}));

const makeDate = (day: number, hour: number) => {
  const date = new Date(2024, 0, 1);
  const daysUntilTarget = (day - date.getDay() + 7) % 7;
  date.setDate(date.getDate() + daysUntilTarget);
  date.setHours(hour, 0, 0, 0);
  return date;
};

describe("isNightTime", () => {
  test.each`
    day  | hour  | expected
    ${1} | ${22} | ${true}
    ${1} | ${23} | ${true}
    ${1} | ${0}  | ${true}
    ${1} | ${5}  | ${true}
    ${1} | ${6}  | ${false}
    ${1} | ${12} | ${false}
    ${1} | ${21} | ${false}
  `("day $day hour $hour → $expected", ({ day, hour, expected }) => {
    const date = makeDate(day, hour);
    expect(isNightTime(date)).toBe(expected);
  });
});

describe("isChangeHour", () => {
  test.each`
    day  | hour   | expected
    ${5} | ${0}   | ${true}
    ${6} | ${0}   | ${true}
    ${0} | ${0}   | ${true}
    ${5} | ${23}  | ${true}
    ${6} | ${23}  | ${false}
    ${0} | ${23}  | ${false}
    ${5} | ${1}   | ${false}
    ${6} | ${1}   | ${true}
    ${0} | ${1}   | ${true}
    ${5} | ${15}  | ${false}
    ${6} | ${15}  | ${false}
    ${0} | ${15}  | ${false}
  `("day $day hour $hour → $expected", ({ day, hour, expected }) => {
    const date = makeDate(day, hour);
    expect(isChangeHour(date)).toBe(expected);
  });
});
