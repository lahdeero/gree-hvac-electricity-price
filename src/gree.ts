import * as Gree from "gree-hvac-client";
import { FanSpeed, GreeClient, GreeProperties } from "./types/types";
import { getLatestPrice } from "./prices";
import { isChangeHour, isNightTime } from "./helpers";
import { getSettings } from "./settings";
import logger from "./logger";

const settings = getSettings();

const shutdownOrKeepOff = async (client: GreeClient, currentProperties: GreeProperties): Promise<void> => {
  if (currentProperties.power === Gree.VALUE.power.off) {
    logger.info("not change hour, no shutdown needed");
    return;
  }
  logger.info("change hour, shutdown or keep off");
  const properties = {
    [Gree.PROPERTY.lights]: Gree.VALUE.lights.off,
    [Gree.PROPERTY.power]: Gree.VALUE.power.off,
  } satisfies Partial<GreeProperties>;
  logger.info(properties);
  await client.setProperties(properties);
};

const turnOrKeepOn = async (client: GreeClient, currentProperties: GreeProperties, date: Date): Promise<void> => {
  if (!isChangeHour(date)) {
    logger.info("not change hour, no turn on needed");
    return;
  }
  logger.info("change hour, turn on or keep on");
  // If the air conditioner is already on, we don't need to do anything
  if (currentProperties.power === Gree.VALUE.power.on) {
    logger.info("air conditioner is already on, no action needed");
    return;
  }
  const nightTime = isNightTime(date);
  const properties = {
    [Gree.PROPERTY.power]: Gree.VALUE.power.on,
    [Gree.PROPERTY.lights]: Gree.VALUE.lights.off,
    [Gree.PROPERTY.mode]: Gree.VALUE.mode.cool,
    [Gree.PROPERTY.swingVert]: nightTime ? Gree.VALUE.swingVert.fixedBottom : Gree.VALUE.swingVert.fixedTop,
    [Gree.PROPERTY.blow]: Gree.VALUE.blow.on,
    [Gree.PROPERTY.temperature]: nightTime ? settings.night_temperature : settings.day_temperature,
    [Gree.PROPERTY.fanSpeed]: nightTime ? FanSpeed.MEDIUMLOW : FanSpeed.LOW,
  } satisfies Partial<GreeProperties>;
  logger.info(properties);
  await client.setProperties(properties);
};

export const gree = async ({
  client,
  updatedProperties,
}: {
  client: GreeClient;
  updatedProperties: GreeProperties;
}) => {
  const date = new Date();
  const latestPrice = await getLatestPrice(date);
  logger.info(`latestPrice: ${latestPrice}`);
  if (latestPrice > settings.price_threshold) {
    logger.info("shutdownOrKeepOff");
    await shutdownOrKeepOff(client, updatedProperties);
  } else if (latestPrice <= settings.price_threshold) {
    logger.info("turnOrKeepOn");
    await turnOrKeepOn(client, updatedProperties, date);
  }
};
