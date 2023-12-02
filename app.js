const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')
const token = '6775787608:AAF2d7l05TtGQTXL12dTyhPyKjFqr9fuIvc'
const bot = new TelegramBot(token , {polling : true})

bot.onText(/\/start/ ,msg => {
  // console.log(msg);
  bot.sendMessage(msg.chat.id , 'سلام , برای اطلاع از قیمت لحظه ای ارز مورد نظر را انتخاب کنید!' ,{
    reply_markup : {
      'keyboard' : [
        ['BTC | بیتکوین' , 'ETH | اتریوم'],
        ['BNB | بایننس' , 'XRP | ریپل'],
        ['SOL | سولانا' , 'ADA | کاردانو']
      ]
    }
  })
})
    setInterval(() => {
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
  if(msg.text == 'BTC | بیتکوین'){  
    bot.sendMessage(msg.chat.id ,`قیمت لحظه ای : ${BTC_price} `)
  }else if(msg.text == 'ETH | اتریوم'){
    bot.sendMessage(msg.chat.id , `قیمت لحظه ای : ${ETH_price} `)
  }else if(msg.text == 'BNB | بایننس'){
    bot.sendMessage(msg.chat.id , `قیمت لحظه ای : ${BNB_price} `)
  }else if(msg.text == 'XRP | ریپل'){
    bot.sendMessage(msg.chat.id , `قیمت لحظه ای : ${XRP_price} `)
  }else if(msg.text == 'SOL | سولانا'){
    bot.sendMessage(msg.chat.id , `قیمت لحظه ای : ${SOL_price} `)
  }else{
    bot.sendMessage(msg.chat.id , `قیمت لحظه ای : ${ADA_price} `)
  }
})

console.log('ok');