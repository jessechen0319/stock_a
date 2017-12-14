//股价连跌15天，要反弹了
//***大盘 */
let resultJsonPath = __dirname + '/../../result/潜龙吸水.json';
const util = require('../../util/Fibonacci');
const jsonfile = require('jsonfile');
jsonfile.writeFileSync(resultJsonPath, []);
function calculate(data, stock){
    try {
        data = JSON.parse(data);
        console.log(data.mashData.length);
        if (data.mashData.length > 155) {
            let one = data.mashData[0].kline;
            let two = data.mashData[1].kline;
            let three = data.mashData[2].kline;
            let four = data.mashData[3].kline;
            let five = data.mashData[4].kline;

            let highest = Math.max(one.high, two.high, three.high, four.high, five.high);
            let lowest = Math.min(one.low, two.low, three.low, four.low, five.low);
            if((highest - lowest)/one.close > 0.20){
                let results = jsonfile.readFileSync(resultJsonPath);
                results.push({ "stock": stock, "date": data.mashData[0].date, "price": data.mashData[0].kline.close });
                console.log(`insert dragon ${stock}`);
                jsonfile.writeFileSync(resultJsonPath, results);
            }

        }
    } catch (error) {
        console.log(error)
    }
        
}

module.exports.calculate = calculate;