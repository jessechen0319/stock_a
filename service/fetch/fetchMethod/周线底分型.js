//股价连跌15天，要反弹了
//***大盘 */
let resultJsonPath = __dirname + '/../../result/周线底分型.json';
const util = require('../../util/Fibonacci');
const jsonfile = require('jsonfile');
jsonfile.writeFileSync(resultJsonPath, []);
function calculate(data, stock){
    try {
        data = JSON.parse(data);
        console.log(data.mashData.length);
        if (data.mashData.length > 155) {
            if(data.mashData[2].kline.high<data.mashData[1].kline.high){
                if(data.mashData[2].kline.high<data.mashData[3].kline.high){
                    if(data.mashData[2].kline.low<data.mashData[1].kline.low){
                        if(data.mashData[2].kline.low<data.mashData[3].kline.low){
                            let results = jsonfile.readFileSync(resultJsonPath);
                            results.push({ "stock": stock, "date": data.mashData[0].date, "price": data.mashData[0].kline.close });
                            console.log(`insert dragon ${stock}`);
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