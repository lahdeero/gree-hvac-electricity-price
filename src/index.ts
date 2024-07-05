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
  if (currentProperties.power === Gree.VALUE.power.off) {
    console.info("not change hour, no shutdown needed");
    return;
  }
  console.info("change hour, shutdown or keep off");

  const properties = {};
  properties[Gree.PROPERTY.lights] = Gree.VALUE.lights.on;
  properties[Gree.PROPERTY.power] = Gree.VALUE.lights.off;
  console.info(properties);
  await client.setProperties(properties);
};

const turnOrKeepOn = async (currentProperties: GreeProperties, date: Date): Promise<void> => {
  if (!isChangeHour(date)) {
    console.info("not change hour, no turn on needed");
    return;
  }
  console.info("change hour, turn on or keep on");

  const properties = {};
  const nightTime = isNightTime(date);
  if (currentProperties.power === Gree.VALUE.power.off) {
    properties[Gree.PROPERTY.power] = Gree.VALUE.power.on;
    properties[Gree.PROPERTY.lights] = Gree.VALUE.lights.on;
    properties[Gree.PROPERTY.mode] = Gree.VALUE.mode.cool;
  }
  const temperature = nightTime ? NIGHTTIME_TEMPERATURE : DAYTIME_TEMPERATURE;
  const fanSpeed = nightTime ? FanSpeed.MEDIUMLOW : FanSpeed.LOW;
  // const swingVert = nightTime ?  Gree.VALUE.swingVert.fixedBottom : Gree.VALUE.swingVert.fixedMidTop;
  // properties[Gree.PROPERTY.swingVert] = swingVert;
  properties[Gree.PROPERTY.temperature] = temperature;
  properties[Gree.PROPERTY.fanSpeed] = fanSpeed;
  properties[Gree.PROPERTY.blow] = Gree.VALUE.blow.on;
  console.info(properties);
  await client.setProperties(properties);
};

client.on('connect', async (client: any) => {
  console.info('connected to', client.getDeviceId());
});

client.on('update', async (updatedProperties: GreeProperties, _properties: GreeProperties) => {
  if (ready) {
    return;
  }
  ready = true;
  console.info("update");
  const date = new Date();
  console.info("date", date.toString());
  const latestPrice = await getLatestPrice(date);
  console.info("latestPrice", latestPrice);
  if (latestPrice > PRICE_THRESHOLD) {
    console.info("shutdownOrKeepOff");
    await shutdownOrKeepOff(updatedProperties);
  } else if (latestPrice <= PRICE_THRESHOLD) {
    console.info("turnOrKeepOn");
    await turnOrKeepOn(updatedProperties, date);
  }
});

client.on('error', (error: any) => {
  console.error(error);
});

setTimeout(() => {
  console.info("exiting...");
  process.exit(0);
}, MAX_PROGRAM_RUN_TIME_MS);
