const axios = require("axios");
require("dotenv").config();
let TABDEAL = process.env.TABDEAL_Route;

// tabdeal pricing
async function tabdeal() {
  try {
    const { data } = await axios.get(TABDEAL);
    const tabdeal_buys = data.bids.map((order) => ({
      price: parseFloat(order[0]),
      quantity: parseFloat(order[1]),
    }));
    const tabdeal_sells = data.asks.map((order) => ({
      price: parseFloat(order[0]),
      quantity: parseFloat(order[1]),
    }));
    return {
      buys: tabdeal_buys,
      sells: tabdeal_sells,
    };
  } catch (error) {
    console.error("Error fetching Tabdeal data:", error);
  }
}

module.exports = { tabdeal };
