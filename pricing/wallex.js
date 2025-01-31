const axios = require("axios");
require("dotenv").config();
let WALLEX = process.env.WALLEX_Route;

// wallex pricing
async function wallex() {
  try {
    const response = await axios.get(WALLEX);
    const asks = response.data.result.ask || [];
    const bids = response.data.result.bid || [];
    return { asks, bids };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { asks: [], bids: [] };
  }
}

module.exports = { wallex };
