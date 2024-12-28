const axios = require("axios");
require("dotenv").config();
let WALLEX = process.env.WALLEX_Route;
let NOBITEX = process.env.NOBITEX_Route;
let RAMZINEX = process.env.RAMZINEX_Route;
let OKEX = process.env.OkEXCHANGE_Route;
let TETHERLAND = process.env.TETHERLAND_Route;
let TABDEAL = process.env.TABDEAL_Route;
let EXIR = process.env.EXIR_Route;

// Fetch data from Wallex
async function wallex() {
  try {
    const { data } = await axios.get(WALLEX);
    return {
      wallex_asks: data.result.ask || [],
      wallex_bids: data.result.bid || [],
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { asks: [], bids: [] };
  }
}

// Fetch data from Ramzinex
async function ramzinex() {
  try {
    const { data } = await axios.get(RAMZINEX);
    return {
      ramzinex_buys: data.data.buys.map((order) => ({
        price: parseFloat(order[0]),
        quantity: parseFloat(order[1]),
      })),
      ramzinex_sells: data.data.sells.map((order) => ({
        price: parseFloat(order[0]),
        quantity: parseFloat(order[1]),
      })),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { buys: [], sells: [] };
  }
}

// Fetch data from Nobitex
async function nobitex() {
  try {
    const { data } = await axios.get(NOBITEX);
    // Check if data and data.data exist
    if (data && data.data) {
      return {
        buys: data.data.bids
          ? data.data.bids.map((order) => ({
              price: parseFloat(order[0]),
              quantity: parseFloat(order[1]),
            }))
          : [],
        sells: data.data.asks
          ? data.data.asks.map((order) => ({
              price: parseFloat(order[0]),
              quantity: parseFloat(order[1]),
            }))
          : [],
      };
    } else {
      return { buys: [], sells: [] };
    }
  } catch (error) {
    console.error("Error fetching Nobitex data:", error);
    return { buys: [], sells: [] };
  }
}

// Fetch data from okex
async function okex() {
  try {
    const { data } = await axios.get(OKEX);
    const okex_buys = data.books.bids; // Store the buys in a variable
    const okex_sells = data.books.asks; // Store the sells in a variable
    return {
      okex_buys,
      okex_sells,
    };
  } catch (error) {
    console.error("Error fetching order book:", error);
  }
}

// Fetch data from tetherLand
async function tetherLand() {
  try {
    const { data } = await axios.get(TETHERLAND);
    const tetherLand_buys = data.data.markets.USDTTMN.bids; // Store the buys in a variable
    const tetherLand_sells = data.data.markets.USDTTMN.asks; // Store the sells in a variable
    return {
      tetherLand_buys,
      tetherLand_sells,
    };
  } catch (error) {
    console.error("Error fetching order book:", error);
  }
}

// Fetch data from tabdeal
async function tabdeal() {
  try {
    const { data } = await axios.get(TABDEAL);
    const tabdeal_buys = data.bids; // Store the buys in a variable
    const tabdeal_sells = data.asks; // Store the sells in a variable
    return {
      tabdeal_buys,
      tabdeal_sells,
    };
  } catch (error) {
    console.error("Error fetching order book:", error);
  }
}

async function exir() {
  try {
    const { data } = await axios.get(EXIR);
    const exir_buys = data["usdt-irt"].bids;
    const exir_sells = data["usdt-irt"].asks;
    console.log(exir_buys, exir_sells);
    return {
      exir_buys,
      exir_sells,
    };
  } catch (error) {
    console.error("Error fetching order book:", error);
  }
}

module.exports = {
  wallex,
  ramzinex,
  nobitex,
  okex,
  tetherLand,
  tabdeal,
  exir,
};
