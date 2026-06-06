import * as Gree from "gree-hvac-client";
import { GreeClient } from "./types/types";
import { gree } from "./gree";
import { getSettings } from "./configuration";
import logger from "./logger";

const { air_condition_ip } = getSettings();
const client: GreeClient = new Gree.Client({ host: air_condition_ip });

client.on('connect', async () => {
  logger.info("connected to", client.getDeviceId());
});

client.on('update', async (updatedProperties) => {
  await gree({client, updatedProperties});
  client.disconnect();
});

client.on('error', (error) => {
  logger.error(error);
});
