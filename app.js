const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();
let TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });
const orderBook = require("./orderBook");
let formatThousands = require("format-thousands");

// // main menu
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `سلام ${msg.from.first_name}  چه کاری برات انجام بدم؟`,
    {
      reply_to_message_id: msg.message_id,
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          ["USDT/IRR | قیمت تتر", "💰 قیمت ارز های دیجیتال"],
          ["💵 دلار | یورو | پوند"],
          ["🌕 سکه", "🛢️ نفت"],
        ],
      },
    }
  );
});

// get date
const moment = require("jalali-moment");
let date = moment().locale("fa").format("YYYY/M/D hh:mm");

// crypto pricing
const coins = [
  "BTC",
  "ETH",
  "XRP",
  "AVAX",
  "TRX",
  "SOL",
  "BNB",
  "ADA",
  "SHIB",
  "TON",
  "USDC",
  "DOGE",
];
const prices = [];
coins.forEach((coin) => {
  setInterval(() => {
    let kucoinApi = `https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${coin}-USDT`;
    axios
      .get(kucoinApi)
      .then(function (response) {
        prices[coin] = response.data.data.price;
      })
      .catch((error) => {
        console.log("err : " + error);
      });
  }, 2 * 1000);
});

// tether pricing
setInterval(() => {
  let nobitex = "https://api.nobitex.ir/v2/orderbook/USDTIRT";
  axios
    .get(nobitex)
    .then(function (response) {
      global.USDT_price = response.data.lastTradePrice;
    })
    .catch((error) => {
      console.log("err: " + error);
    });
}, 2 * 1000);

// USD, EUR, GBP pricing
const fetchCurrencyPrice = (key) => {
  let dprice = `https://raw.githubusercontent.com/margani/pricedb/main/tgju/current/${key}/latest.json`;
  axios
    .get(dprice)
    .then(function (response) {
      const priceData = response.data;
      const mappings = {
        price_dollar_rl: ["dollar", "dollar_max", "dollar_min", "dollar_ts"],
        price_gbp: ["gbp", "gbp_max", "gbp_min", "gbp_ts"],
        price_eur: ["eur", "eur_max", "eur_min", "eur_ts"],
      };
      const keys = mappings[key];
      if (keys) {
        keys.forEach((globalKey, index) => {
          global[globalKey] =
            priceData[
              index === 0
                ? "p"
                : index === 1
                ? "h"
                : index === 2
                ? "l"
                : index === 3
                ? "ts"
                : index === 4
                ? "dp"
                : index === 5
                ? "dt"
                : "t"
            ];
        });
      }
    })
    .catch((error) => {
      console.log("err :" + error);
    });
};
let allKey = ["price_dollar_rl", "price_gbp", "price_eur"];
allKey.forEach((key) => {
  setInterval(() => fetchCurrencyPrice(key), 3 * 1000);
});

// oil pricing
const oilKeys = ["oil_opec", "oil_brent", "oil"];
oilKeys.forEach((key) => {
  setInterval(() => {
    const oilPriceUrl = `https://raw.githubusercontent.com/margani/pricedb/main/tgju/current/${key}/latest.json`;
    axios
      .get(oilPriceUrl)
      .then((response) => {
        global[key] = response.data.p;
        global[`${key}_ts`] = response.data.ts;
      })
      .catch((error) => console.log("err :" + error));
  }, 3 * 1000);
});

// coin pricing
const fetchCoinPrices = (keys) => {
  keys.forEach((key) => {
    setInterval(() => {
      axios
        .get(
          `https://raw.githubusercontent.com/margani/pricedb/main/tgju/current/retail_${key}/latest.json`
        )
        .then((response) => {
          const { p, h, l, ts } = response.data;
          global[`seke${key.charAt(0).toUpperCase() + key.slice(1)}`] = p;
          global[`seke${key.charAt(0).toUpperCase() + key.slice(1)}_max`] = h;
          global[`seke${key.charAt(0).toUpperCase() + key.slice(1)}_min`] = l;
          global[`seke${key.charAt(0).toUpperCase() + key.slice(1)}_ts`] = ts;
        })
        .catch((error) => console.log("err :" + error));
    }, 3 * 1000);
  });
};
let coinKeys = ["sekee", "sekeb", "nim", "rob", "gerami"];
fetchCoinPrices(coinKeys);

// return the unavailable price message
const getUnavailablePriceMessage = () => {
  return `🚫 قیمت ها در دسترس نیستند.لطفا مجدد تلاش کنید`;
};

// coin message
const generateCoinMessage = () => {
  const coinTypes = {
    sekee: "امامی",
    sekeb: "بهار آزادی",
    nim: "نیم سکه",
    rob: "ربع سکه",
    gerami: "گرمی",
  };
  // check if any prices are undefined
  const pricesUnavailable = Object.keys(coinTypes).some(
    (type) =>
      global[`seke${type.charAt(0).toUpperCase() + type.slice(1)}`] ===
      undefined
  );
  if (pricesUnavailable) {
    return getUnavailablePriceMessage();
  }
  let message = `قیمت سکه : \n\n\n🔸 قیمت ها به ریال است \n\n\n`;
  const hr = `ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ`;
  Object.keys(coinTypes).forEach((type, index) => {
    message +=
      `🌕 ${coinTypes[type]} : \n\n` +
      `💵 قیمت کنونی : ${
        global[`seke${type.charAt(0).toUpperCase() + type.slice(1)}`]
      }\n` +
      `📉 بیشترین قیمت : ${
        global[`seke${type.charAt(0).toUpperCase() + type.slice(1)}_max`]
      }\n` +
      `📈 کمترین قیمت : ${
        global[`seke${type.charAt(0).toUpperCase() + type.slice(1)}_min`]
      }\n\n` +
      `⏰ زمان ثبت آخرین نرخ : ${
        global[`seke${type.charAt(0).toUpperCase() + type.slice(1)}_ts`]
      }\n\n`;

    if (index < Object.keys(coinTypes).length - 1) {
      message += `${hr}\n\n`;
    }
  });
  message += `\n🗓 ${date}\n\n ${process.env.ID}`;
  return message;
};
setInterval(() => {
  coinMessage = generateCoinMessage();
}, 2 * 1000);

// oli message
const hr =
  "ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ";
const oilTypes = [
  { key: "oil_opec", label: "نفت(opec)" },
  { key: "oil_brent", label: "نفت(brent)" },
  { key: "oil", label: "نفت(WTI)" },
];
setInterval(() => {
  const prices = oilTypes.map((oil) => global[oil.key]);
  oilMessage = prices.includes(undefined)
    ? getUnavailablePriceMessage()
    : `🔸 قیمت ها به دلار است\n\n\n` +
      oilTypes
        .map(
          (oil, index) =>
            `▪️ ${oil.label} : ${
              prices[index]
            } دلار\n\n⏰ زمان ثبت آخرین نرخ : ${global[`${oil.key}_ts`]}\n\n` +
            (index < oilTypes.length - 1 ? `${hr}\n\n` : "")
        )
        .join("") +
      `\n🗓 ${date}\n\n ${process.env.ID}`;
}, 2 * 1000);

// USD, EUR, GBP message
const createCurrencyMessage = (currency, data) => {
  // Check if any price data is undefined
  const pricesUnavailable = Object.values(data).some(
    (value) => value === undefined
  );
  if (pricesUnavailable) {
    return getUnavailablePriceMessage();
  }
  return (
    `| ${currency}-IRR |\n\n🔸 قیمت ها به ریال است\n\n\n` +
    `نرخ فعلی : ${data.current} \n\n` +
    `بالاترین : ${data.max}\n\n` +
    `پایین ترین : ${data.min}\n\n` +
    `زمان ثبت آخرین نرخ : ${data.time}\n\n\n🗓 ${date}\n\n ${process.env.ID}`
  );
};
setInterval(() => {
  const currencies = ["dollar", "eur", "gbp"];
  currencies.forEach((currency) => {
    const data = {
      current: global[currency],
      max: global[`${currency}_max`],
      min: global[`${currency}_min`],
      time: global[`${currency}_ts`],
    };
    global[`${currency}Message`] = createCurrencyMessage(
      currency.toUpperCase(),
      data
    );
  });
}, 2 * 1000);

// crypto message
const orderedCoins = [
  "BTC",
  "ETH",
  "SOL",
  "BNB",
  "XRP",
  "DOGE",
  "USDC",
  "ADA",
  "TRX",
  "AVAX",
  "SHIB",
  "TON",
];
setInterval(function makeMsg() {
  message = `قیمت ارز های دیجیتال : \n \n \n`;
  // check if any prices are undefined
  const pricesUnavailable = orderedCoins.some(
    (coin) => prices[coin] === undefined
  );
  if (pricesUnavailable) {
    message = getUnavailablePriceMessage();
  } else {
    orderedCoins.forEach((coin) => {
      if (prices[coin]) {
        message += `▪ ${coin}-USDT : ${formatThousands(
          prices[coin],
          ","
        )} \n \n`;
      }
    });
    Object.entries(prices)
      .sort()
      .forEach((entry) => {
        const [key, value] = entry;
        if (!orderedCoins.includes(key)) {
          message += `▪ ${key}-USDT : ${value} \n \n`;
        }
      });
    message += `\n🗓 ${date} \n \n`;
    message += `${process.env.ID}`;
  }
}, 2 * 1000);

//convert persian num to en num
function convertPersianToEnglish(input) {
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  let output = "";
  for (let char of input) {
    const index = persianNumbers.indexOf(char);
    if (index !== -1) {
      output += englishNumbers[index];
    } else {
      output += char;
    }
  }
  return output;
}

// response and menu and tether message
let amountRequested = "";
let action = "";
let pr_text = "بازگشت به منوی اصلی";

bot.on("message", (msg) => {
  switch (msg.text) {
    case "USDT/IRR | قیمت تتر":
      bot.sendMessage(msg.chat.id, `انتخاب کن`, {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [[`قیمت کنونی`, "مقایسه بازار ها"], [`${pr_text}`]],
        },
        reply_to_message_id: msg.message_id,
      });
      break;

    case pr_text:
      bot.sendMessage(msg.chat.id, `خب چه کاری برات انجام بدم؟`, {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            ["USDT/IRR | قیمت تتر", "💰 قیمت ارز های دیجیتال"],
            ["💵 دلار | یورو | پوند"],
            ["🌕 سکه", "🛢️ نفت"],
          ],
        },
        reply_to_message_id: msg.message_id,
      });
      break;

    case "قیمت کنونی":
      if (global.USDT_price === undefined) {
        bot.sendMessage(msg.chat.id, getUnavailablePriceMessage(), {
          reply_to_message_id: msg.message_id,
        });
      } else {
        bot.sendMessage(
          msg.chat.id,
          `قیمت کنونی تتر : ${formatThousands(
            global.USDT_price,
            ","
          )} ریال\n\n 🗓 ${date}\n\n ${process.env.ID}`,
          {
            reply_to_message_id: msg.message_id,
          }
        );
      }
      break;

    case "مقایسه بازار ها":
      bot.sendMessage(msg.chat.id, `انتخاب کن`, {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [["فروش", "خرید"], [`بازگشت به منوی قبلی`]],
        },
        reply_to_message_id: msg.message_id,
      });
      break;

    case "بازگشت به منوی قبلی":
      bot.sendMessage(msg.chat.id, `انتخاب کن`, {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [[`قیمت کنونی`, "مقایسه بازار ها"], [`${pr_text}`]],
        },
        reply_to_message_id: msg.message_id,
      });
      break;

    case "خرید":
    case "فروش":
      action = msg.text;
      bot
        .sendMessage(
          msg.chat.id,
          `مقدار مورد نظر خود را برای ${action} وارد کنید.`,
          {
            reply_markup: {
              resize_keyboard: true,
              keyboard: [["بازگشت"]],
            },
            reply_to_message_id: msg.message_id,
          }
        )
        .then(() => {
          const handleUserResponse = async (response) => {
            if (response.text === "بازگشت") {
              return bot.sendMessage(msg.chat.id, "انتخاب کن", {
                reply_markup: {
                  resize_keyboard: true,
                  keyboard: [["قیمت کنونی", "مقایسه بازار ها"], [`${pr_text}`]],
                },
                reply_to_message_id: response.message_id,
              });
            }

            const convertedAmount = convertPersianToEnglish(response.text);
            const amountRequested = parseFloat(convertedAmount);

            if (isNaN(amountRequested) || amountRequested <= 0) {
              return bot
                .sendMessage(msg.chat.id, "لطفا یک مقدار معتبر وارد کنید.", {
                  reply_to_message_id: response.message_id,
                })
                .then(() => {
                  bot.once("message", handleUserResponse);
                });
            }

            if (amountRequested > 99999) {
              return bot
                .sendMessage(
                  msg.chat.id,
                  "مقدار وارد شده باید حداکثر چهار رقم باشد.",
                  { reply_to_message_id: response.message_id }
                )
                .then(() => {
                  bot.once("message", handleUserResponse);
                });
            }

            bot.sendMessage(msg.chat.id, "لطفا منتظر بمانید.", {
              reply_to_message_id: response.message_id,
            });

            try {
              const result = await orderBook.getOrderBook(
                action,
                amountRequested
              );
              if (result.bestMessage) {
                bot.sendMessage(msg.chat.id, result.bestMessage, {
                  reply_markup: {
                    resize_keyboard: true,
                    keyboard: [["فروش", "خرید"], [`بازگشت به منوی قبلی`]],
                  },
                  reply_to_message_id: response.message_id,
                });
              } else {
                bot.sendMessage(msg.chat.id, "لطفا دوباره تلاش کنید.", {
                  reply_markup: {
                    resize_keyboard: true,
                    keyboard: [
                      ["قیمت کنونی", "مقایسه بازار ها"],
                      [`${pr_text}`],
                    ],
                  },
                  reply_to_message_id: response.message_id,
                });
              }
            } catch (error) {
              bot.sendMessage(
                msg.chat.id,
                "خطایی رخ داده است. لطفا دوباره تلاش کنید.",
                {
                  reply_to_message_id: response.message_id,
                }
              );
            }
          };

          bot.once("message", handleUserResponse);
        });
      break;

    case "💰 قیمت ارز های دیجیتال":
      bot.sendMessage(msg.chat.id, `${message}`, {
        reply_to_message_id: msg.message_id,
      });
      break;

    case "💵 دلار | یورو | پوند":
      bot.sendMessage(msg.chat.id, `انتخاب کن`, {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [[`دلار(USD)`], ["یورو(EUR)", "پوند(GBP)"], [`${pr_text}`]],
        },
        reply_to_message_id: msg.message_id,
      });
      break;

    case "دلار(USD)":
      bot.sendMessage(msg.chat.id, `${dollarMessage}`, {
        reply_to_message_id: msg.message_id,
      });
      break;

    case "یورو(EUR)":
      bot.sendMessage(msg.chat.id, `${eurMessage}`, {
        reply_to_message_id: msg.message_id,
      });
      break;

    case "پوند(GBP)":
      bot.sendMessage(msg.chat.id, `${gbpMessage}`, {
        reply_to_message_id: msg.message_id,
      });
      break;

    case "🌕 سکه":
      bot.sendMessage(msg.chat.id, `${coinMessage}`, {
        reply_to_message_id: msg.message_id,
      });
      break;

    case "🛢️ نفت":
      bot.sendMessage(msg.chat.id, `${oilMessage}`, {
        reply_to_message_id: msg.message_id,
      });
      break;

    default:
      // Handle any other cases or unknown messages
      break;
  }
});
