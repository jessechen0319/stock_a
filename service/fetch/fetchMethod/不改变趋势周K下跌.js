//股价连跌15天，要反弹了
//***大盘 */
let resultJsonPath = __dirname + '/../../result/不改变趋势周K下跌.json';
const util = require('../../util/Fibonacci');
const jsonfile = require('jsonfile');
jsonfile.writeFileSync(resultJsonPath, []);
function calculate(data, stock){
    try {
        data = JSON.parse(data);
        console.log(data.mashData.length);
        if (data.mashData.length > 155) {
            let compareLength = (data.mashData[1].kline.high - data.mashData[1].kline.low)/data.mashData[1].kline.close;
            if(compareLength >=0.05){
                if(data.mashData[1].kline.high>data.mashData[0].kline.high){
                    if(data.mashData[1].kline.low<data.mashData[0].kline.low){
                        if(Math.abs(data.mashData[0].kline.close - data.mashData[1].kline.high)>Math.abs(data.mashData[0].kline.close - data.mashData[1].kline.low)){
                            let results = jsonfile.readFileSync(resultJsonPath);
                            results.push({ "stock": stock, "date": data.mashData[0].date, "price": data.mashData[0].kline.close });
                            console.log(`insert week K weekly ${stock}`);
                            jsonfile.writeFileSync(resultJsonPath, results);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
        
}

module.exports.calculate = calculate;