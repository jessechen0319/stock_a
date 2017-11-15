
let resultJsonPath = __dirname + '/../../result/沿着13天线爬.json';
const jsonfile = require('jsonfile');
jsonfile.writeFileSync(resultJsonPath, []);
const util = require('../../util/Fibonacci');

function calculate(data, stock){
    try {
        data = JSON.parse(data);

        if(data.mashData.length>160){

            //计算非布拉切均线
            data = util.generateFibonacci(data);

            if(data.mashData[0].ma144< data.mashData[0].ma55 && data.mashData[0].ma55 < data.mashData[0].ma34 && data.mashData[0].ma34 < data.mashData[0].ma13){
                if(data.mashData[0].ma144>data.mashData[1].ma144){//趋势线向上
                    if(data.mashData[0].ma55>data.mashData[1].ma55){
                        if(data.mashData[0].ma13>data.mashData[1].ma13){
                            let calculated = data.mashData[0].kline.close - data.mashData[0].ma13;
                            calculated = calculated / data.mashData[0].kline.close;
                            calculated = Math.abs(calculated);
                            if(calculated<0.03){//在13天均线附近3个点。
                                if(data.mashData[0].macd.macd>0){//macd是红的
                                    let results = jsonfile.readFileSync(resultJsonPath);
                                    results.push({ "stock": stock, "date": data.mashData[0].date, "price": data.mashData[0].kline.close });
                                    console.log(`insert growth ${stock}`);
                                    jsonfile.writeFileSync(resultJsonPath, results);
                                }
                            }
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