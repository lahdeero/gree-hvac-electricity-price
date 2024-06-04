export enum FanSpeed {
  AUTO = 'auto',
  LOW = 'low',
  MEDIUMLOW = 'mediumLow',
  MEDIUM = 'medium',
  MEDIUMHIGH = 'mediumHigh',
  HIGH = 'high'
}

enum OnOff {
  on = 'on',
  off = 'off'
}

export type GreeProperties = {
  power: OnOff,
  mode: string,
  temperatureUnit: string,
  temperature: number,
  currentTemperature: number,
  fanSpeed: FanSpeed,
  air: OnOff,
  blow: OnOff,
  health: OnOff,
  sleep: OnOff,
  lights: OnOff,
  swingHor: string,
  swingVert: string,
  quiet: OnOff,
  turbo: OnOff,
  powerSave: OnOff,
  safetyHeating: OnOff
};

export type MatchingPriceEntry = {
  price: number
  startDate: string
  endDate: string
};
