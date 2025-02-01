# This is my bot for providing cryptocurrency prices
### and also this bot is a bot that is getting updated every day with the prices of currencies, gold, etc in IRR (Iranian Rial).
### It also has the ability to compare Tether prices on Iranian exchanges.




* I update the offered prices from the [Kucoin](https://www.kucoin.com/) site.
* Tether prices are updated from [Nobitex](https://nobitex.ir/panel/exchange/usdt-irt), [wallex](https://wallex.ir/app/trade/USDTTMN), [Ramzinex](https://ramzinex.com/app/markets/11/spot), [tabdeal](https://tabdeal.org/panel/trade/USDT_IRT) for comparison.

* The price of Tether is taken separately from [Nobitex](https://nobitex.ir/).


> [!NOTE]
> In this application, there is a variable named TOKEN.
> This variable contains the Telegram bot token, which is stored in the .env file with the name .BOT_TOKEN. 

### .env example
* `BOT_TOKEN= 'your bot token'`

#### Dependencies:
- axios : 1.6.2
- dotenv : 16.3.1
- path : 0.12.7
- node-telegram-bot-api : 0.64.0

about [axios](https://axios-http.com/)

> I'm currently adding more features to the bot

