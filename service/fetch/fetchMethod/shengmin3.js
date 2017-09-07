// k线昨天3个点以上的阳线，今天的最高点要小于昨天最高点，收盘是平盘或下跌的。
// 指标，
// macd是红色的，
// 成交量今天的量小于等于昨天的3/2。
let resultJsonPath = __dirname + '/../../result/shengmin3.json';
const jsonfile = require('jsonfile');
function calculate(data, stock) {
    try {
        data = JSON.parse(data);
        let increase2 = data.mashData[1]['kline']['close'] - data.mashData[1]['kline']['preClose'];
        increase2 = increase2 / data.mashData[1]['kline']['preClose'];
        if (increase2 > 0.03 && data.mashData[0]['kline']['high'] < data.mashData[1]['kline']['high'] && data.mashData[0]['macd']['macd'] > 0 && 2 * data.mashData[1]['kline']['volume'] > 3 * data.mashData[0]['kline']['volume']) {
            var results = jsonfile.readFileSync(resultJsonPath);
            results.push({ "stock": stock, "date": data.mashData[0].date, "price": data.mashData[0].kline.close });
            console.log(`insert shengmin3 ${stock}`);
            jsonfile.writeFileSync(resultJsonPath, results);
        }
    } catch (error) {
        console.log(error);
        console.log(`error with stock->${stock}`);
    }

}

module.exports.calculate = calculate;