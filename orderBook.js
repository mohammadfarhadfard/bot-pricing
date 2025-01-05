const axios = require("axios");
require("dotenv").config();
let WALLEX = process.env.WALLEX_Route;
let NOBITEX = process.env.NOBITEX_Route;
let RAMZINEX = process.env.RAMZINEX_Route;
let OKEX = process.env.OkEXCHANGE_Route;
let TETHERLAND = process.env.TETHERLAND_Route;
let TABDEAL = process.env.TABDEAL_Route;
let EXIR = process.env.EXIR_Route;

//Fetch data from Wallex
async function wallex() {
  try {
    const { data } = await axios.get(WALLEX);
    const wallex_buys = data.result.bid;
    const wallex_sells = data.result.ask;
    return {
      wallex_buys,
      wallex_sells
    };        
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Fetch data from Ramzinex
async function ramzinex(){
  try {
    const { data } = await axios.get(RAMZINEX)
    const ramzinex_buys = data.data.buys.map((order) => ({
      price: parseFloat(order[0]),
      quantity: parseFloat(order[1]),
    }));
    const ramzinex_sells = data.data.sells.map((order) => ({
      price: parseFloat(order[0]),
      quantity: parseFloat(order[1]),
    }));    
    return {
      ramzinex_buys,
      ramzinex_sells,
    };
  } catch (error) {
    console.error("Error fetching Ramzinex data:", error);
  }
}

// Fetch data from Nobitex
async function nobitex(){
  try {
    const { data } = await axios.get(NOBITEX);
    const nobitex_buys = data.bids.map((order) => ({
      price : parseFloat(order[0]),
      quantity : parseFloat(order[1]),
    }));
    const nobitex_sells = data.asks.map((order) => ({
      price : parseFloat(order[0]),
      quantity : parseFloat(order[1])
    }));    
    return {
      nobitex_buys,
      nobitex_sells,
    };
   } catch (error) {
    console.error("Error fetching Nobitex data:", error);
  }
}

// Fetch data from okex
async function okex() {
  try {
    const { data } = await axios.get(OKEX);
    const okex_buys = data.books.bids; 
    const okex_sells = data.books.asks;     
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
    const tetherLand_buys = data.data.markets.USDTTMN.bids; 
    const tetherLand_sells = data.data.markets.USDTTMN.asks;     
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
    const tabdeal_buys = data.bids; 
    const tabdeal_sells = data.asks;    
    return {
      tabdeal_buys,
      tabdeal_sells,
    };
  } catch (error) {
    console.error("Error fetching order book:", error);
  }
}

// Fetch data from exir
async function exir() {
  try {
    const { data } = await axios.get(EXIR);
    const exir_buys = data["usdt-irt"].bids;
    const exir_sells = data["usdt-irt"].asks;    
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
