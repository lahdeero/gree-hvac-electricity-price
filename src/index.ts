import * as Gree from 'gree-hvac-client';
import { getLatestPrice } from './prices';
import { isChangeHour, isNightTime } from '../helpers';
import { FanSpeed, GreeProperties } from './types/types';

const AIR_CONDITION_IP = '192.168.1.111';
const client = new Gree.Client({host: AIR_CONDITION_IP });
let ready = false; // // Only run once

const MAX_PROGRAM_RUN_TIME_MS = 10_000;
const PRICE_THRESHOLD = 15;
const DAYTIME_TEMPERATURE = 22;
const NIGHTTIME_TEMPERATURE = 19;

const shutdownOrKeepOff = async (currentProperties: GreeProperties): Promise<void> => {
  const properties = {};
  if (currentProperties.power === 'on') {
    properties[Gree.PROPERTY.lights] = Gree.VALUE.lights.on;
    properties[Gree.PROPERTY.power] = Gree.VALUE.lights.off;
    console.log(properties);
  }
  await client.setProperties(properties);
};

const turnOrKeepOn = async (currentProperties: GreeProperties, date: Date): Promise<void> => {
  const properties = {};
  const nightTime = isNightTime(date);
  if (currentProperties.power === 'off') {
    if (!isChangeHour(date)) {
      return;
    }
    properties[Gree.PROPERTY.power] = Gree.VALUE.power.on;
    properties[Gree.PROPERTY.lights] = Gree.VALUE.lights.on;
    properties[Gree.PROPERTY.mode] = Gree.VALUE.mode.cool;
  }
  const temperature = nightTime ? NIGHTTIME_TEMPERATURE : DAYTIME_TEMPERATURE;
  const fanSpeed = nightTime ? FanSpeed.MEDIUMLOW : FanSpeed.LOW;
  properties[Gree.PROPERTY.temperature] = temperature;
  properties[Gree.PROPERTY.fanSpeed] = fanSpeed;
  console.log(properties);
  await client.setProperties(properties);
};

client.on('connect', async (client: any) => {
  console.log('connected to', client.getDeviceId());
});

client.on('update', async (updatedProperties: GreeProperties, _properties: GreeProperties) => {
  if (ready) {
    return;
  }
  ready = true;
  console.log("update");
  const date = new Date();
  console.log("date", date.toString());
  const latestPrice = await getLatestPrice(date);
  console.log("latestPrice", latestPrice);
  if (latestPrice > PRICE_THRESHOLD) {
    console.log("shutdownOrKeepOff");
    await shutdownOrKeepOff(updatedProperties);
  } else if (latestPrice <= PRICE_THRESHOLD) {
    console.log("turnOrKeepOn");
    await turnOrKeepOn(updatedProperties, date);
  }
});

client.on('error', (error: any) => {
  console.error(error);
});

setTimeout(() => {
  console.log("exiting...");
  process.exit(0);
}, MAX_PROGRAM_RUN_TIME_MS);
