import * as Gree from "gree-hvac-client";
import { air_condition_ip } from "./settings.json";
import { GreeClient } from "./types/types";
import { gree } from "./gree";

const client: GreeClient = new Gree.Client({ host: air_condition_ip });

client.on('connect', async () => {
  console.info("connected to", client.getDeviceId());
});

client.on('update', updatedProperties => {
  gree({client, updatedProperties});
  client.disconnect();
});

client.on('success', updatedProperties => {
  console.log('properties updated:', updatedProperties);
  client.disconnect();
});

client.on('error', error => {
  console.error(error);
});
