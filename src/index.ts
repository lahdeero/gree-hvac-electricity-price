import * as Gree from "gree-hvac-client";
import { GreeClient } from "./types/types";
import { gree } from "./gree";
import { getConfiguration } from "./configuration";

const { air_condition_ip } = getConfiguration();
const client: GreeClient = new Gree.Client({ host: air_condition_ip });

client.on('connect', async () => {
  console.info("connected to", client.getDeviceId());
});

client.on('update', async (updatedProperties) => {
  await gree({client, updatedProperties});
});

client.on('success', (updatedProperties) => {
  console.info('properties updated:', updatedProperties);
  client.disconnect();
});

client.on('error', (error) => {
  console.error(error);
});
