const axios = require("axios");
require("dotenv").config();
let formatThousands = require("format-thousands");
let NOBITEX = process.env.NOBITEX_Route;
const wallex = require("./pricing/wallex");
const ramzinex = require("./pricing/ramzinex");
const tabdeal = require("./pricing/tabdeal");

// get date
const moment = require("jalali-moment");
let date = moment().locale("fa").format("YYYY/M/D hh:mm");

// nobitex pricing and Averaging
async function getOrderBook(action, amountRequested) {
  try {
    const response = await axios.get(NOBITEX);
    const buy = response.data.bids;
    const sell = response.data.asks;

    let totalPriceNobitex = 0;
    let totalAmountNobitex = 0;

    if (action === "خرید") {
      for (let order of sell) {
        const price = parseFloat(order[0]);
        const availableAmount = parseFloat(order[1]);

        if (amountRequested <= availableAmount) {
          totalPriceNobitex += price * amountRequested;
          totalAmountNobitex += amountRequested;
          break;
        } else {
          totalPriceNobitex += price * availableAmount;
          totalAmountNobitex += availableAmount;
          amountRequested -= availableAmount;
        }
      }
    } else if (action === "فروش") {
      for (let order of buy) {
        const price = parseFloat(order[0]);
        const availableAmount = parseFloat(order[1]);

        if (amountRequested <= availableAmount) {
          totalPriceNobitex += price * amountRequested;
          totalAmountNobitex += amountRequested;
          break;
        } else {
          totalPriceNobitex += price * availableAmount;
          totalAmountNobitex += availableAmount;
          amountRequested -= availableAmount;
        }
      }
    }

    //average price for nobitex
    const averagePriceNobitex =
      totalAmountNobitex > 0 ? totalPriceNobitex / totalAmountNobitex : 0;

    // data from wallex
    const { asks, bids } = await wallex.wallex();
    let totalPriceWallex = calculateTotal(asks, bids, action, amountRequested);

    const { buys: ramzinexBuys, sells: ramzinexSells } =
      await ramzinex.ramzinex();

    const { buys: tabdealBuys, sells: tabdealSells } = await tabdeal.tabdeal();

    let totalPriceRamzinex = calculateTotal(
      ramzinexSells,
      ramzinexBuys,
      action,
      amountRequested
    );

    let totalPriceTabdeal = calculateTotal(
      tabdealSells,
      tabdealBuys,
      action,
      amountRequested
    );

    if (action === "خرید") {
      total_buy_nobitex = totalPriceNobitex / 10;
      total__buy_wallex = totalPriceWallex;
      total_buy_ramzinex = totalPriceRamzinex / 10;
      total_buy_tabdeal = totalPriceTabdeal;
    } else {
      total_sell_nobitex = totalPriceNobitex / 10;
      total__sell_wallex = totalPriceWallex;
      total_sell_ramzinex = totalPriceRamzinex / 10;
      total_sell_tabdeal = totalPriceTabdeal;
    }

    let maxPrice;
    let bestExchange;

    if (action === "فروش") {
      maxPrice = Math.max(
        total_sell_nobitex,
        total__sell_wallex,
        total_sell_ramzinex,
        total_sell_tabdeal
      );
      bestExchange =
        maxPrice === total_sell_nobitex
          ? "NOBITEX"
          : maxPrice === total__sell_wallex
          ? "WALLEX"
          : maxPrice === total_sell_ramzinex
          ? "Ramzinex"
          : "Tabdeal";
      const exchangeTranslations = {
        NOBITEX: "نوبیتکس",
        WALLEX: "والکس",
        Ramzinex: "رمزینکس",
        Tabdeal: "تبدیل",
      };
      return {
        bestMessage: `🔸قیمت ها به تومان است\n\n▪ نوبیتکس : ${formatThousands(
          Math.floor(total_sell_nobitex),
          ","
        )} \n▪ والکس : ${formatThousands(
          Math.floor(total__sell_wallex),
          ","
        )} \n▪ رمزینکس : ${formatThousands(
          Math.floor(total_sell_ramzinex),
          ","
        )} \n▪ تبدیل : ${formatThousands(
          Math.floor(total_sell_tabdeal),
          ","
        )} \n\n⬆️ بهترین صرافی برای ${action} ${amountRequested} تتر ${
          exchangeTranslations[bestExchange]
        } با قیمت کل ${formatThousands(
          Math.floor(maxPrice),
          ","
        )}  است.\n\n 🗓${date}\n\n ${process.env.ID}`,
      };
    } else {
      maxPrice = Math.min(
        total_buy_nobitex,
        total__buy_wallex,
        total_buy_ramzinex,
        total_buy_tabdeal
      );
      bestExchange =
        maxPrice === total_buy_nobitex
          ? "NOBITEX"
          : maxPrice === total__buy_wallex
          ? "WALLEX"
          : maxPrice === total_buy_ramzinex
          ? "Ramzinex"
          : "Tabdeal";
    }
    const exchangeTranslations = {
      NOBITEX: "نوبیتکس",
      WALLEX: "والکس",
      Ramzinex: "رمزینکس",
      Tabdeal: "تبدیل",
    };
    return {
      bestMessage: `🔸 قیمت ها به تومان است\n\n▪ نوبیتکس : ${formatThousands(
        Math.floor(total_buy_nobitex),
        ","
      )} \n▪ والکس : ${formatThousands(
        Math.floor(total__buy_wallex),
        ","
      )} \n▪ رمزینکس : ${formatThousands(
        Math.floor(total_buy_ramzinex),
        ","
      )} \n▪ تبدیل : ${formatThousands(
        Math.floor(total_buy_tabdeal),
        ","
      )} \n\n⬇️ بهترین صرافی برای ${action} ${amountRequested} تتر ${
        exchangeTranslations[bestExchange]
      } با قیمت کل ${formatThousands(
        Math.floor(maxPrice),
        ","
      )}  است.\n\n 🗓${date}\n\n ${process.env.ID}`,
    };
  } catch (error) {
    return { bestMessage: `🚫 مشکلی پیش آمده دوباره تلاش کنید.` };
  }
}

// calculate total cost/revenue
function calculateTotal(asks, bids, action, amountRequested) {
  if (action === "خرید") {
    let totalCost = 0;
    for (const ask of asks) {
      const quantity = Math.min(ask.quantity, amountRequested);
      totalCost += ask.price * quantity;
      amountRequested -= quantity;
      if (amountRequested <= 0) break;
    }
    return totalCost;
  } else if (action === "فروش") {
    let totalRevenue = 0;
    for (const bid of bids) {
      const quantity = Math.min(bid.quantity, amountRequested);
      totalRevenue += bid.price * quantity;
      amountRequested -= quantity;
      if (amountRequested <= 0) break;
    }
    return totalRevenue;
  } else {
    return null;
  }
}

module.exports.getOrderBook = getOrderBook;
