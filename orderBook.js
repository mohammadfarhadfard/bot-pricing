const axios = require("axios");
require("dotenv").config();
let WALLEX = process.env.WALLEX_Route;
let NOBITEX = process.env.NOBITEX_Route;
let RAMZINEX = process.env.RAMZINEX_Route;
let OKEX = process.env.OkExchange_Route;
let TETHER_LAND = process.env.TetherLand_Route;
let TABDEAL = process.env.Tabdeal_route

// Fetch data from Wallex
async function wallex() {
    try {
        const { data } = await axios.get(WALLEX);
        return { wallex_asks: data.result.ask || [], wallex_bids: data.result.bid || [] };
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
            ramzinex_buys: data.data.buys.map(order => ({ price: parseFloat(order[0]), quantity: parseFloat(order[1]) })),
            ramzinex_sells: data.data.sells.map(order => ({ price: parseFloat(order[0]), quantity: parseFloat(order[1]) }))
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
            nobitex_buys: data.data.bids,
            nobitex_sells: data.data.asks
        }
    } catch (error) {
        console.error("Error fetching order book:", error);
    }
    console.log(buys,sells);
    
}

// Fetch data from okex
async function okex() {
    try {
        const { data } = await axios.get(OKEX);
        const okex_buys = data.books.bids; // Store the buys in a variable
        const okex_sells = data.books.asks; // Store the sells in a variable
        return {
            okex_buys,
            okex_sells
        };
    } catch (error) {
        console.error("Error fetching order book:", error);
    }
}

// Fetch data from tetherLand
async function tetherLand() {
    try {
        const { data } = await axios.get(TETHER_LAND);
        const tetherLand_buys = data.data.markets.USDTTMN.bids; // Store the buys in a variable
        const tetherLand_sells = data.data.markets.USDTTMN.asks; // Store the sells in a variable
        return {
            tetherLand_buys,
            tetherLand_sells
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
            tabdeal_sells
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
    tabdeal
}