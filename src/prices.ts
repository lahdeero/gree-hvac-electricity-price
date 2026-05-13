import axios from 'axios';
import { PriceEntry } from './types/types';

const LATEST_PRICES_ENDPOINT = 'https://api.porssisahko.net/v1/latest-prices.json';
const PRICE_NOT_AVAILABLE_PRICE = Number.MAX_SAFE_INTEGER;

const fetchLatestPriceData  = async () => {
  const response = await axios.get(LATEST_PRICES_ENDPOINT);
  return response.data;
};

const getPriceForDate = (date: Date, prices: PriceEntry[]): number => {
  const matchingPriceEntry: PriceEntry | undefined = prices.find(
    (price) => new Date(price.startDate) <= date && new Date(price.endDate) > date
  );
  const ret = Number(matchingPriceEntry?.price);
  if (!ret || isNaN(ret) || !isFinite(ret)) {
    return PRICE_NOT_AVAILABLE_PRICE;
  }
  return ret;
};

export const getLatestPrice = async (date: Date): Promise<number> => {
  const { prices } = await fetchLatestPriceData();
  const price = Number(getPriceForDate(date, prices));
  return price;
};
