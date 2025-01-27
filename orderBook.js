const axios = require("axios");
require("dotenv").config();

const exchanges = {
  wallex: process.env.WALLEX_Route,
  ramzinex: process.env.RAMZINEX_Route,
  nobitex: process.env.NOBITEX_Route,
  okex: process.env.OkEXCHANGE_Route,
  tetherLand: process.env.TETHERLAND_Route,
  tabdeal: process.env.TABDEAL_Route,
  exir: process.env.EXIR_Route,
};

const logExchangeData = (exchange, data) => {
  console.log(`[${exchange}] Data: ${JSON.stringify(data)}`);
};

const processExchangeData = async (exchange, url) => {
  try {
    const { data } = await axios.get(url);
    switch (exchange) {
      case "wallex":
        return {
          wallex_buys: data.result.bid,
          wallex_sells: data.result.ask
        };
      case "ramzinex":
        console.log(`Processing Ramzinex data...`);
        return {
          ramzinex_buys: data.data.buys.map((o) => ({ price: parseFloat(o[0]), quantity: parseFloat(o[1]) })),
          ramzinex_sells: data.data.sells.map((o) => ({ price: parseFloat(o[0]), quantity: parseFloat(o[1]) })),
        };
      case "nobitex":
      case "tabdeal":
        console.log(`Processing ${exchange} data...`);
        if (data.bids && data.asks) {
          return {
            [`${exchange}_buys`]: data.bids.map((o) => ({ price: parseFloat(o[0]), quantity: parseFloat(o[1]) })),
            [`${exchange}_sells`]: data.asks.map((o) => ({ price: parseFloat(o[0]), quantity: parseFloat(o[1]) })),
          };
        } else if (data.data && data.data.bids && data.data.asks) {
          return {
            [`${exchange}_buys`]: data.data.bids.map((o) => ({ price: parseFloat(o[0]), quantity: parseFloat(o[1]) })),
            [`${exchange}_sells`]: data.data.asks.map((o) => ({ price: parseFloat(o[0]), quantity: parseFloat(o[1]) })),
          };
        } else if (data && data.bids && data.asks) {
          return {
            [`${exchange}_buys`]: data.bids.map((o) => ({ price: parseFloat(o[0]), quantity: parseFloat(o[1]) })),
            [`${exchange}_sells`]: data.asks.map((o) => ({ price: parseFloat(o[0]), quantity: parseFloat(o[1]) })),
          };
        } else {
          console.error(`Error processing ${exchange} data: No books found`);
          return {};
        }
      case "okex":
        console.log(`Processing OKEx data...`);
        return {
          okex_buys: data.books.bids.map((o) => ({ price: parseFloat(o[0]), quantity: parseFloat(o[1]) })),
          okex_sells: data.books.asks.map((o) => ({ price: parseFloat(o[0]), quantity: parseFloat(o[1]) })),
        };
      case "tetherLand":
        return {
          tetherLand_buys: data.data.markets.USDTTMN.bids.map((o) => ({ price: parseFloat(o.price), quantity: parseFloat(o.amount) })),
          tetherLand_sells: data.data.markets.USDTTMN.asks.map((o) => ({ price: parseFloat(o.price), quantity: parseFloat(o.amount) })),
        };
      case "exir":
        console.log(`Processing Exir data...`);
        return {
          exir_buys: data["usdt-irt"].bids.map((o) => ({ price: parseFloat(o[0]), quantity: parseFloat(o[1]) })),
          exir_sells: data["usdt-irt"].asks.map((o) => ({ price: parseFloat(o[0]), quantity: parseFloat(o[1]) })),
        };
      default:
        return {};
    }
  } catch (error) {
    console.error(`Error fetching ${exchange} data:`, error);
  }
};

const main = async () => {
  const exchangeFunctions = Object.fromEntries(Object.keys(exchanges).map((exchange) => [exchange, () => processExchangeData(exchange, exchanges[exchange])]));
  for (const exchange in exchangeFunctions) {
    const data = await exchangeFunctions[exchange]();
    console.log(`[${exchange}] Data:`);
    console.log(data);
  }
};

main();