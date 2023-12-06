const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')
require('dotenv').config()
let TOKEN = process.env.BOT_TOKEN
const bot = new TelegramBot(TOKEN , {polling : true})

bot.onText(/\/start/ ,msg => {
  bot.sendMessage(msg.chat.id , 'سلام , برای اطلاع از قیمت لحظه ای , ارز مورد نظر خود را انتخاب کنید!' ,{
    reply_markup : {
      'keyboard' : [
        ['USDT/IRT | تتر'],
        ['BTC | بیتکوین' , 'ETH | اتریوم'],
        ['BNB | بایننس' , 'XRP | ریپل'],
        ['SOL | سولانا' , 'ADA | کاردانو'],
        ['لیست کامل قیمت ارز های دیجیتال']
      ]
    }
  })
})
    setInterval(() => {

      let nobitex='https://api.nobitex.ir/v2/orderbook/USDTIRT'

      axios.get(nobitex)
      .then( function(response) {
         USDT_price = response.data.lastTradePrice
       })
      .catch(error => {
      console.log("err: " +error)
      }) 

      let date="https://api.keybit.ir/time"

    axios.get(date)
    .then( function(response) {
         date_now= response.data.time24.full.en
         location_now=response.data.timezone.name 
    })
    .catch(error => {
     console.log("err: " +error)
    })

      let kucoinApi_BTC="https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=BTC-USDT"
    axios.get(kucoinApi_BTC)
    .then( response => {
         BTC_price = response.data.data.price
    })
    .catch(error => {
     console.log("err: " +error)
    })

    let kucoinApi_ETH="https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=ETH-USDT"
    axios.get(kucoinApi_ETH)
    .then( function(response) {
         ETH_price = response.data.data.price
    })
    .catch(error => {
     console.log("err: " +error)
    })

    let kucoinApi_BNB="https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=BNB-USDT"
    axios.get(kucoinApi_BNB)
    .then( function(response) {
         BNB_price = response.data.data.price
    })
    .catch(error => {
     console.log("err: " +error)
    })

    let kucoinApi_XRP="https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=XRP-USDT"
    axios.get(kucoinApi_XRP)
    .then( function(response) {
         XRP_price = response.data.data.price
    })
    .catch(error => {
     console.log("err: " +error)
    })

    let kucoinApi_SOL="https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=SOL-USDT"
    axios.get(kucoinApi_SOL)
    .then( function(response) {
         SOL_price = response.data.data.price
    })
    .catch(error => {
     console.log("err: " +error)
    })

    let kucoinApi_ADA="https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=ADA-USDT"
    axios.get(kucoinApi_ADA)
    .then( function(response) {
         ADA_price = response.data.data.price
    })
    .catch(error => {
     console.log("err: " +error)
    })
    } , 2500)
    


  bot.on('message' , msg => {
  if(msg.text == 'USDT/IRT | تتر'){
   bot.sendMessage(msg.chat.id , `قیمت لحظه ای : ${USDT_price}  \n${date_now} \n${location_now}`)
    } else if(msg.text == 'BTC | بیتکوین'){  
    bot.sendMessage(msg.chat.id ,`قیمت لحظه ای : ${BTC_price} `)
  }else if(msg.text == 'ETH | اتریوم'){
    bot.sendMessage(msg.chat.id , `قیمت لحظه ای : ${ETH_price} `)
  }else if(msg.text == 'BNB | بایننس'){
    bot.sendMessage(msg.chat.id , `قیمت لحظه ای : ${BNB_price} `)
  }else if(msg.text == 'XRP | ریپل'){
    bot.sendMessage(msg.chat.id , `قیمت لحظه ای : ${XRP_price} `)
  }else if(msg.text == 'SOL | سولانا'){
    bot.sendMessage(msg.chat.id , `قیمت لحظه ای : ${SOL_price} `)
  }else if(msg.text == 'ADA | کاردانو'){
    bot.sendMessage(msg.chat.id , `قیمت لحظه ای : ${ADA_price} `)
  }else if(msg.text == 'لیست کامل قیمت ارز های دیجیتال'){
    bot.sendMessage(msg.chat.id , `برای اطلاع از قیمت ارز های دیجیتال به کانال ما مراجعه کنید \n@t.me/myTestApisjd`)
  }
})