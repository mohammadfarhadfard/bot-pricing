const axios = require("axios");
require("dotenv").config();
let RAMZINEX = process.env.RAMZINEX_Route;

// ramzinex pricing
async function ramzinex() {
  try {
    const response = await axios.get(RAMZINEX);

    const ramzinex_buys = response.data.data.buys.map((order) => ({
      price: parseFloat(order[0]),
      quantity: parseFloat(order[1]),
    }));

    const ramzinex_sells = response.data.data.sells.map((order) => ({
      price: parseFloat(order[0]),
      quantity: parseFloat(order[1]),
    }));

    return {
      buys: ramzinex_buys,
      sells: ramzinex_sells,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { buys: [], sells: [] };
  }
}

module.exports = { ramzinex };
