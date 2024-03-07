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



//getting date
const moment = require('jalali-moment');
let date = moment().locale('fa').format('YYYY/M/D hh:mm');



//crypto pricing
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



//getting dollar,eur,gbp prices
let allKey = ['price_dollar_rl','price_gbp','price_eur']
allKey.forEach((key) => {
  setInterval(() => {
    let dprice = `https://raw.githubusercontent.com/margani/pricedb/main/tgju/current/${key}/latest.json`
    axios.get(dprice)
    .then(function(response){
      if(dprice == `https://raw.githubusercontent.com/margani/pricedb/main/tgju/current/price_dollar_rl/latest.json`){
        global.dollar = response.data.p
        global.dollar_max = response.data.h
        global.dollar_min = response.data.l
        global.dollar_swing = response.data.d
        global.dollar_Percent = response.data.dp
        global.dollar_dt = response.data.dt
        global.dollar_s= response.data.t
      }else if (dprice == `https://raw.githubusercontent.com/margani/pricedb/main/tgju/current/price_gbp/latest.json`){
        global.gbp = response.data.p
        global.gbp_max = response.data.h
        global.gbp_min = response.data.l
        global.gbp_swing = response.data.d
        global.gbp_Percent = response.data.dp
        global.gbp_dt = response.data.dt
        global.gbp_s= response.data.t
      }else{
        global.eur = response.data.p
        global.eur_max = response.data.h
        global.eur_min = response.data.l
        global.eur_swing = response.data.d
        global.eur_Percent = response.data.dp
        global.eur_dt = response.data.dt
        global.eur_s= response.data.t
      }
    })
    .catch(error => {
      console.log("err :" + error);
    })
  }, 3*1000);
})



//gettin coin prices
let coinKey = ['retail_sekee','retail_sekeb','retail_nim','retail_rob','retail_gerami']
coinKey.forEach((key) => {
  setInterval(() => {
    let coinPrice = `https://raw.githubusercontent.com/margani/pricedb/main/tgju/current/${key}/latest.json`
    axios.get(coinPrice)
    .then(function(response){
      if(coinPrice == `https://raw.githubusercontent.com/margani/pricedb/main/tgju/current/retail_sekee/latest.json`){
        global.sekeEm = response.data.p
        global.sekeEm_max = response.data.h
        global.sekeEm_min = response.data.l
        global.sekeEm_s= response.data.t
      }else if (coinPrice == `https://raw.githubusercontent.com/margani/pricedb/main/tgju/current/retail_sekeb/latest.json`){
        global.sekeB = response.data.p
        global.sekeB_max = response.data.h
        global.sekeB_min = response.data.l
        global.sekeB_s= response.data.t
      }else if(coinPrice == `https://raw.githubusercontent.com/margani/pricedb/main/tgju/current/retail_nim/latest.json`){
        global.sekeNim = response.data.p
        global.sekeNim_max = response.data.h
        global.sekeNim_min = response.data.l
        global.sekeNim_s= response.data.t
      }else if(coinPrice == `https://raw.githubusercontent.com/margani/pricedb/main/tgju/current/retail_rob/latest.json`){
        global.sekeRob = response.data.p
        global.sekeRob_max = response.data.h
        global.sekeRob_min = response.data.l
        global.sekeRob_s= response.data.t
      }else{
        global.sekeGer = response.data.p
        global.sekeGer_max = response.data.h
        global.sekeGer_min = response.data.l
        global.sekeGer_s= response.data.t
      }
    })
    .catch(error => {
      console.log("err :" + error);
    })
  }, 3*1000);
})



//gitting oil prices
let oilKey = ['oil_opec','oil_brent','oil']
oilKey.forEach((key) => {
  setInterval(() => {
    let oilPrice = `https://raw.githubusercontent.com/margani/pricedb/main/tgju/current/${key}/latest.json`
    axios.get(oilPrice)
    .then(function(response){
      if(oilPrice == `https://raw.githubusercontent.com/margani/pricedb/main/tgju/current/oil_opec/latest.json`){
        global.oil_opec = response.data.p
        global.oil_opec_t = response.data.t
      }else if(oilPrice == `https://raw.githubusercontent.com/margani/pricedb/main/tgju/current/oil_brent/latest.json`){
        global.oil_brent = response.data.p
        global.oil_brent_t = response.data.t
      }else{
        global.oil_WTI = response.data.p
        global.oil_WTI_t = response.data.t
      }
    })
    .catch(error => {
      console.log("err :" + error);
    })
  }, 3*1000);
})



//oli message
hr = `ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ`
setInterval(() => {
  oliMessage = `🔸 قیمت ها به دلار است\n \n \n ▪️ نفت(opec) : ${global.oil_opec} دلار \n \n ⏰ زمان ثبت آخرین نرخ : ${global.oil_opec_t} \n \n${hr} \n
▪️ نفت(brent) : ${global.oil_brent} دلار \n \n ⏰ زمان ثبت آخرین نرخ : ${global.oil_brent_t} \n \n${hr} \n
▪️ نفت(WTI) : ${global.oil_WTI} دلار \n \n ⏰ زمان ثبت آخرین نرخ : ${global.oil_WTI_t} \n \n \n 🗓 ${date}`
}, 2*1000);



//coin message
hr = `ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ`
setInterval(() => {
  coinMessage =`قیمت سکه : \n\n\n🔸 قیمت ها به ریال است \n\n\n🌕 سکه امامی : \n\n💵 قیمت کنونی : ${global.sekeEm}\n📉 بیشترین قیمت : ${global.sekeEm_max}\n📈 کمترین قیمت : ${global.sekeEm_min}\n\n\n⏰ زمان ثبت آخرین نرخ : ${global.sekeEm_s}\n\n${hr}\n
🌕 سکه بهار آزادی : \n\n💵 قیمت کنونی : ${global.sekeB}\n📉 بیشترین قیمت : ${global.sekeB_max}\n📈 کمترین قیمت : ${global.sekeB_min}\n\n\n⏰ زمان ثبت آخرین نرخ : ${global.sekeB_s}\n\n${hr}\n
🌕 نیم سکه بهار آزادی : \n\n💵 قیمت کنونی : ${global.sekeNim}\n📉 بیشترین قیمت : ${global.sekeNim_max}\n📈 کمترین قیمت : ${global.sekeNim_min}\n\n\n⏰ زمان ثبت آخرین نرخ : ${global.sekeNim_s}\n\n${hr}\n
🌕 ربع سکه بهار آزادی : \n\n💵 قیمت کنونی : ${global.sekeRob}\n📉 بیشترین قیمت : ${global.sekeRob_max}\n📈 کمترین قیمت : ${global.sekeRob_min}\n\n\n⏰ زمان ثبت آخرین نرخ : ${global.sekeRob_s}\n\n${hr}\n
🌕 سکه گرمی  : \n\n💵 قیمت کنونی : ${global.sekeGer}\n📉 بیشترین قیمت : ${global.sekeGer_max}\n📈 کمترین قیمت : ${global.sekeGer_min}\n\n\n⏰ زمان ثبت آخرین نرخ : ${global.sekeGer_s}\n\n\n🗓 ${date}`
}, 2*1000);



//usd,eur,gbp message
setInterval(() => {
  dollarMessage = `| USD-IRR |\n🔸 قیمت ها به ریال است \n \n \n نرخ فعلی : ${global.dollar} \n \n بالاترین قیمت روز : ${global.dollar_max}
    \n پایین ترین قیمت روز : ${global.dollar_min} \n \n بیشترین مقدار نوسان روز : ${global.dollar_swing}
    \n درصد بیشترین نوسان روز : ${global.dollar_Percent} \n \n زمان ثبت آخرین نرخ : ${global.dollar_s} \n \n \n 🗓 ${date}`

    eurMessage = `| EUR-IRR |\n🔸 قیمت ها به ریال است \n \n \n نرخ فعلی : ${global.eur} \n \n بالاترین قیمت روز : ${global.eur_max}
    \n پایین ترین قیمت روز : ${global.eur_min} \n \n بیشترین مقدار نوسان روز : ${global.eur_swing}
    \n درصد بیشترین نوسان روز : ${global.eur_Percent} \n \n زمان ثبت آخرین نرخ : ${global.eur_s} \n \n \n 🗓 ${date}`

    gbpMessage = `| GBP-IRR |\n🔸 قیمت ها به ریال است \n \n \n نرخ فعلی : ${global.gbp} \n \n بالاترین قیمت روز : ${global.gbp_max}
    \n پایین ترین قیمت روز : ${global.gbp_min} \n \n بیشترین مقدار نوسان روز : ${global.gbp_swing}
    \n درصد بیشترین نوسان روز : ${global.gbp_Percent} \n \n زمان ثبت آخرین نرخ : ${global.gbp_s} \n \n \n 🗓 ${date}`

}, 2*1000);



//crypto message
setInterval(function makeMsg(){
  message = `قیمت ارز های دیجیتال : \n \n \n`
  Object.entries(prices).sort().forEach(entry => {
     const [key,value] = entry;
    message += `▪ ${key}-USDT : ${value} \n \n`
    // console.log(`${key} : ${value}`);
  })
  message += ` \n \n 🗓 ${date}`
},2*1000)



//response and menu and tether message
let pr_text = 'بازگشت به منوی اصلی'
bot.on('message' , msg => {
  if(msg.text == 'USDT/IRR | قیمت تتر'){
    bot.sendMessage(msg.chat.id , `قیمت لحظه ای : ${USDT_price} ریال\n  \n 🗓 ${date}`,{reply_to_message_id: msg.message_id})
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