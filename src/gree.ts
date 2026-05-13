import { GreeClient, GreeProperties } from "./types/types";
import * as Gree from "gree-hvac-client";
import { getLatestPrice } from "./prices";
import { isChangeHour, isNightTime } from "./helpers";
import settings from "./settings.json";

const shutdownOrKeepOff = async (
  client: GreeClient,
  currentProperties: GreeProperties
): Promise<void> => {
  if (currentProperties.power === Gree.VALUE.power.off) {
    console.info("not change hour, no shutdown needed");
    return;
  }
  console.info("change hour, shutdown or keep off");
  const properties = {
    [Gree.PROPERTY.lights]: Gree.VALUE.lights.off,
    [Gree.PROPERTY.power]: Gree.VALUE.power.off
  } satisfies Partial<GreeProperties>;
  console.info(properties);
  await client.setProperties(properties);
};


const turnOrKeepOn = async (
  client: GreeClient,
  currentProperties: GreeProperties,
  date: Date
): Promise<void> => {
  if (!isChangeHour(date)) {
    console.info("not change hour, no turn on needed");
    return;
  }
  console.info("change hour, turn on or keep on");
  // If the air conditioner is already on, we don't need to do anything
  if (currentProperties.power === Gree.VALUE.power.on) {
    console.info("air conditioner is already on, no action needed");
    return;
  }
  const nightTime = isNightTime(date);
  const properties = {
    [Gree.PROPERTY.power]: Gree.VALUE.power.on,
    [Gree.PROPERTY.lights]: Gree.VALUE.lights.off,
    [Gree.PROPERTY.mode]: Gree.VALUE.mode.cool,
    [Gree.PROPERTY.swingVert]: nightTime ? Gree.VALUE.swingVert.fixedBottom : Gree.VALUE.swingVert.fixedTop,
    [Gree.PROPERTY.blow]: Gree.VALUE.blow.on
  } satisfies Partial<GreeProperties>;
  console.info(properties);
  await client.setProperties(properties);
};

export const gree = async ({client, updatedProperties}: { client: GreeClient; updatedProperties: GreeProperties }) => {
  console.info("update");
  const date = new Date();
  console.info("date", date.toString());
  const latestPrice = await getLatestPrice(date);
  console.info("latestPrice", latestPrice);
  if (latestPrice > settings.price_threshold) {
    console.info("shutdownOrKeepOff");
    await shutdownOrKeepOff(client, updatedProperties);
  } else if (latestPrice <= settings.price_threshold) {
    console.info("turnOrKeepOn");
    await turnOrKeepOn(client, updatedProperties, date);
  }
};
