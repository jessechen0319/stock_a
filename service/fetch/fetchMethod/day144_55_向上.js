//股价最少冲出两根均线，站上所有均线，34，55是斜率向上的

let resultJsonPath = __dirname + '/../../result/day144_55_向上.json';
const jsonfile = require('jsonfile');
jsonfile.writeFileSync(resultJsonPath, []);
const util = require('../../util/Fibonacci');

function calculate(data, stock) {
    try {
        data = JSON.parse(data);

        if (data.mashData.length > 160) {

            //计算非布拉切均线
            data = util.generateFibonacci(data);
            if (data.mashData[0].ma144 >= data.mashData[1].ma144) {
                if (data.mashData[0].ma55 >= data.mashData[1].ma55) {
                    if (data.mashData[0].ma144 <= data.mashData[0].ma55) {
                        let results = jsonfile.readFileSync(resultJsonPath);
                        results.push({ "stock": stock, "date": data.mashData[0].date, "price": data.mashData[0].kline.close })
                        jsonfile.writeFileSync(resultJsonPath, results);
                    }


                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports.calculate = calculate;