import axios from 'axios';
import { MatchingPriceEntry } from './types/types';

const LATEST_PRICES_ENDPOINT = 'https://api.porssisahko.net/v1/latest-prices.json';
const PRICE_NOT_AVAILABLE_PRICE = 100;

const fetchLatestPriceData  = async () => {
  const response = await axios.get(LATEST_PRICES_ENDPOINT);
  // console.log("response", response)
  return response.data;
};

const getPriceForDate = (date: Date, prices): number => {
  const matchingPriceEntry: MatchingPriceEntry = prices.find(
    (price) => new Date(price.startDate) <= date && new Date(price.endDate) > date
  );
  const ret = Number(matchingPriceEntry.price);
  if (isNaN(ret) || !isFinite(ret)) {
    return PRICE_NOT_AVAILABLE_PRICE;
  }
  return ret;
};

// const { prices } = await fetchLatestPriceData();

export const getLatestPrice = async (date: Date): Promise<number> => {
  const { prices } = await fetchLatestPriceData();
  const price = Number(getPriceForDate(date, prices));
  return price;
};
