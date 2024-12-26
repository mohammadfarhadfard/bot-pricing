const axios = require("axios");
require("dotenv").config();
let WALLEX = process.env.WALLEX_Route;
let NOBITEX = process.env.NOBITEX_Route;
let RAMZINEX = process.env.RAMZINEX_Route;

// Fetch data from Wallex
async function wallex() {
    try {
        const { data } = await axios.get(WALLEX);
        return { asks: data.result.ask || [], bids: data.result.bid || [] };
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
            buys: data.data.buys.map(order => ({ price: parseFloat(order[0]), quantity: parseFloat(order[1]) })),
            sells: data.data.sells.map(order => ({ price: parseFloat(order[0]), quantity: parseFloat(order[1]) }))
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { buys: [], sells: [] };
    }
}

// Fetch data from Nobitex
async function nobitex() {
    try {
        const { data } = await axios.get(NOBITEX);
        return {
            buys: data.data.bids,
            sells: data.data.asks
        }
    } catch (error) {
        console.error("Error fetching order book:", error);
    }
}

module.exports = {
    wallex,
    ramzinex,
    nobitex
}