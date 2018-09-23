
let resultJsonPath = __dirname + '/../../result/day144.json';
const jsonfile = require('jsonfile');
jsonfile.writeFileSync(resultJsonPath, []);
const util = require('../../util/Fibonacci');

function calculate(data, stock) {
    try {
        data = JSON.parse(data);

        if (data.mashData.length >= 160) {

            //计算非布拉切均线
            data = util.generateFibonacci(data);
            console.log(data.mashData[0].ma144);
            console.log(data.mashData[5].ma144);
            if (data.mashData[0].ma144 > data.mashData[5].ma144) {
                let results = jsonfile.readFileSync(resultJsonPath);
                results.push({ "stock": stock, "date": data.mashData[0].date, "price": data.mashData[0].kline.close })
                jsonfile.writeFileSync(resultJsonPath, results);
            }
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports.calculate = calculate;