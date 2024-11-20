const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')
require('dotenv').config()
let TOKEN = process.env.BOT_TOKEN
const bot = new TelegramBot(TOKEN , {polling : true})

//main menu
bot.onText(/\/start/ ,msg => {
  bot.sendMessage(msg.chat.id , `سلام ${msg.from.first_name}  چه کاری برات انجام بدم؟` ,{reply_to_message_id: msg.message_id},{
    reply_markup : {
      'resize_keyboard' : true,
      'keyboard' : [
        ['USDT/IRR | قیمت تتر','💰 قیمت ارز های دیجیتال'],
        ['💵 دلار | یورو | پوند'],
        ['🌕 سکه','🛢️ نفت']
      ]
    }
  })
})

//get date
const moment = require('jalali-moment');
let date = moment().locale('fa').format('YYYY/M/D hh:mm');

//get crypto prices
const coins = ["BTC","ETH","XRP","AVAX","TRX","SOL","BNB","ADA","SHIB","TON","USDC","DOGE"]
const prices = []
coins.forEach((coin)=>{
  setInterval(()=>{
    let kucoinApi = `https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${coin}-USDT`
    axios.get(kucoinApi)
    .then(function(response){
      prices[coin] = response.data.data.price
    })
    .catch(error => {
      console.log("err : " +error);
    }) 
  },2 * 1000)
})

//get tether price
setInterval(() =>{
  let nobitex='https://api.nobitex.ir/v2/orderbook/USDTIRT'
    axios.get(nobitex)
    .then( function(response) {
      global.USDT_price = response.data.lastTradePrice
      // console.log(global.USDT_price);
     })
    .catch(error => {
    console.log("err: " +error)
    })
} , 2 * 1000)

//get dollar,eur,gbp prices
const fetchCurrencyPrice = (key) => {
  let dprice = `https://raw.githubusercontent.com/margani/pricedb/main/tgju/current/${key}/latest.json`;
  axios.get(dprice)
    .then(function(response) {
      const priceData = response.data;
      const mappings = {
        'price_dollar_rl': ['dollar', 'dollar_max', 'dollar_min', 'dollar_swing', 'dollar_Percent', 'dollar_dt', 'dollar_s'],
        'price_gbp': ['gbp', 'gbp_max', 'gbp_min', 'gbp_swing', 'gbp_Percent', 'gbp_dt', 'gbp_s'],
        'price_eur': ['eur', 'eur_max', 'eur_min', 'eur_swing', 'eur_Percent', 'eur_dt', 'eur_s']
      };
      const keys = mappings[key];
      if (keys) {
        keys.forEach((globalKey, index) => {
          global[globalKey] = priceData[index === 0 ? 'p' : index === 1 ? 'h' : index === 2 ? 'l' : index === 3 ? 'd' : index === 4 ? 'dp' : index === 5 ? 'dt' : 't'];
        });
      }
    })
    .catch(error => {
      console.log("err :" + error);
    });
};

let allKey = ['price_dollar_rl', 'price_gbp', 'price_eur'];
allKey.forEach((key) => {
  setInterval(() => fetchCurrencyPrice(key), 3 * 1000);
});

// get oil prices
const oilKeys = ['oil_opec', 'oil_brent', 'oil'];
oilKeys.forEach((key) => {
  setInterval(() => {
    const oilPriceUrl = `https://raw.githubusercontent.com/margani/pricedb/main/tgju/current/${key}/latest.json`;
    axios.get(oilPriceUrl)
      .then(response => {
        global[key] = response.data.p;
        global[`${key}_t`] = response.data.t;
      })
      .catch(error => console.log("err :" + error));
  }, 3 * 1000);
});

// get coin prices
const fetchCoinPrices = (keys) => {
  keys.forEach((key) => {
    setInterval(() => {
      axios.get(`https://raw.githubusercontent.com/margani/pricedb/main/tgju/current/retail_${key}/latest.json`)
        .then(response => {
          const { p, h, l, t } = response.data;
          global[`seke${key.charAt(0).toUpperCase() + key.slice(1)}`] = p;
          global[`seke${key.charAt(0).toUpperCase() + key.slice(1)}_max`] = h;
          global[`seke${key.charAt(0).toUpperCase() + key.slice(1)}_min`] = l;
          global[`seke${key.charAt(0).toUpperCase() + key.slice(1)}_s`] = t;
        })
        .catch(error => console.log("err :" + error));
    }, 3 * 1000);
  });
};

let coinKeys = ['sekee', 'sekeb', 'nim', 'rob', 'gerami'];
fetchCoinPrices(coinKeys); // Fetch prices for all coin types

// coin message
const generateCoinMessage = () => {
  const coinTypes = {
    sekee: 'امامی',
    sekeb: 'بهار آزادی',
    nim: 'نیم سکه',
    rob: 'ربع سکه',
    gerami: 'گرمی'
  };

  let message = `قیمت سکه : \n\n\n🔸 قیمت ها به ریال است \n\n\n`;
  const hr = `ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ`;
  Object.keys(coinTypes).forEach((type, index) => {
    message += `🌕 ${coinTypes[type]} : \n\n` +
               `💵 قیمت کنونی : ${global[`seke${type.charAt(0).toUpperCase() + type.slice(1)}`]}\n` +
               `📉 بیشترین قیمت : ${global[`seke${type.charAt(0).toUpperCase() + type.slice(1)}_max`]}\n` +
               `📈 کمترین قیمت : ${global[`seke${type.charAt(0).toUpperCase() + type.slice(1)}_min`]}\n\n` +
               `⏰ زمان ثبت آخرین نرخ : ${global[`seke${type.charAt(0).toUpperCase() + type.slice(1)}_s`]}\n\n`;
    
    // Add horizontal rule after each coin except the last one
    if (index < Object.keys(coinTypes).length - 1) {
      message += `${hr}\n\n`;
    }
  });
  message += `\n🗓 ${date}`;
  return message;
};

// set interval for coin message
setInterval(() => {
  coinMessage = generateCoinMessage();
}, 2 * 1000);

// oli message
const hr = 'ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ';
setInterval(() => {
  oliMessage = `🔸 قیمت ها به دلار است\n\n\n` +
               `▪️ نفت(opec) : ${global.oil_opec} دلار\n\n ⏰  زمان ثبت آخرین نرخ : ${global.oil_opec_t}\n\n` +
               `${hr}\n\n` +
               `▪️ نفت(brent) : ${global.oil_brent} دلار\n\n ⏰ زمان ثبت آخرین نرخ : ${global.oil_brent_t}\n\n` +
               `${hr}\n\n` +
               `▪️ نفت(WTI) : ${global.oil} دلار\n\n ⏰ زمان ثبت آخرین نرخ : ${global.oil_t}\n\n\n 🗓 ${date}`;
}, 2 * 1000);

// usd,eur,gbp message
setInterval(() => {
  dollarMessage = `| USD-IRR |\n\n🔸 قیمت ها به ریال است \n \n \n نرخ فعلی : ${global.dollar} \n \n بالاترین قیمت روز : ${global.dollar_max}
    \n پایین ترین قیمت روز : ${global.dollar_min} \n \n بیشترین مقدار نوسان روز : ${global.dollar_swing}
    \n درصد بیشترین نوسان روز : ${global.dollar_Percent} \n \n زمان ثبت آخرین نرخ : ${global.dollar_s} \n \n \n 🗓 ${date}`

    eurMessage = `| EUR-IRR |\n\n🔸 قیمت ها به ریال است \n \n \n نرخ فعلی : ${global.eur} \n \n بالاترین قیمت روز : ${global.eur_max}
    \n پایین ترین قیمت روز : ${global.eur_min} \n \n بیشترین مقدار نوسان روز : ${global.eur_swing}
    \n درصد بیشترین نوسان روز : ${global.eur_Percent} \n \n زمان ثبت آخرین نرخ : ${global.eur_s} \n \n \n 🗓 ${date}`

    gbpMessage = `| GBP-IRR |\n\n🔸 قیمت ها به ریال است \n \n \n نرخ فعلی : ${global.gbp} \n \n بالاترین قیمت روز : ${global.gbp_max}
    \n پایین ترین قیمت روز : ${global.gbp_min} \n \n بیشترین مقدار نوسان روز : ${global.gbp_swing}
    \n درصد بیشترین نوسان روز : ${global.gbp_Percent} \n \n زمان ثبت آخرین نرخ : ${global.gbp_s} \n \n \n 🗓 ${date}`
}, 2*1000);

// crypto message
const orderedCoins = ["BTC", "ETH", "BNB", "XRP", "AVAX", "TRX", "SOL", "ADA", "SHIB", "TON", "USDC", "DOGE"];
setInterval(function makeMsg(){
  message = `قیمت ارز های دیجیتال : \n \n \n`;
  orderedCoins.forEach(coin => {
    if (prices[coin]) { 
      message += `▪ ${coin}-USDT : ${prices[coin]} \n \n`;
    }
  });
  Object.entries(prices).sort().forEach(entry => {
    const [key, value] = entry;
    if (!orderedCoins.includes(key)) { 
      message += `▪ ${key}-USDT : ${value} \n \n`;
    }
  });
  message += ` \n \n 🗓 ${date}`;
}, 2*1000);

// response and menu and tether message
let pr_text = 'بازگشت به منوی اصلی'
bot.on('message' , msg => {
  if(msg.text == 'USDT/IRR | قیمت تتر'){
    bot.sendMessage(msg.chat.id , `قیمت لحظه ای : ${USDT_price} ریال\n\n 🗓 ${date}`,{reply_to_message_id: msg.message_id})
  }else if(msg.text == '💰 قیمت ارز های دیجیتال'){
    bot.sendMessage(msg.chat.id , `${message}`,{reply_to_message_id: msg.message_id})
  }else if(msg.text == '💵 دلار | یورو | پوند'){
    bot.sendMessage(msg.chat.id , `انتخاب کن`,{
      reply_markup : {
        'resize_keyboard' : true,
        'keyboard' : [
          [`دلار(USD)`],
          ['یورو(EUR)','پوند(GBP)'],
          [`${pr_text}`]
        ]
      }
    })
  }else if (msg.text == `دلار(USD)`){
    bot.sendMessage(msg.chat.id , `${dollarMessage}`,{reply_to_message_id: msg.message_id})
  }else if(msg.text == 'یورو(EUR)'){
    bot.sendMessage(msg.chat.id , `${eurMessage}`,{reply_to_message_id: msg.message_id})
  }else if(msg.text == 'پوند(GBP)'){
    bot.sendMessage(msg.chat.id , `${gbpMessage}`,{reply_to_message_id: msg.message_id})  
  }else if(msg.text == `${pr_text}`){
    bot.sendMessage(msg.chat.id , `از منوی زیر یکی رو انتخاب کن`,{
      reply_markup : {
        'resize_keyboard' : true,
        'keyboard' : [
          ['USDT/IRR | قیمت تتر','💰 قیمت ارز های دیجیتال'],
          ['💵 دلار | یورو | پوند'],
          ['🌕 سکه','🛢️ نفت']
        ]
      }
    })
  }else if(msg.text == '🌕 سکه'){
    bot.sendMessage(msg.chat.id , `${coinMessage}`,{reply_to_message_id: msg.message_id})
  }else if(msg.text == '🛢️ نفت'){
    bot.sendMessage(msg.chat.id , `${oliMessage}`,{reply_to_message_id: msg.message_id})
  }
})