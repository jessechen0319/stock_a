
let resultJsonPath = __dirname + '/../../result/启动.json';
const jsonfile = require('jsonfile');
jsonfile.writeFileSync(resultJsonPath, []);
const util = require('../../util/Fibonacci');

function calculate(data, stock) {
    try {
        data = JSON.parse(data);

        if (data.mashData.length >= 160) {

            //计算非布拉切均线
            data = util.generateFibonacci(data);

            if (data.mashData[0].ma13 > data.mashData[0].ma34) {
                if (data.mashData[0].ma13 < data.mashData[0].ma55) {

                    // if (data.mashData[0].ma144 > data.mashData[3].ma144) {
                    //     let calc = data.mashData[0].ma144 - data.mashData[0].kline.close;
                    //     calc = calc/data.mashData[0].kline.close;
                    //     if(calc>0.1){
                            let results = jsonfile.readFileSync(resultJsonPath);
                            results.push({ "stock": stock, "date": data.mashData[0].date, "price": data.mashData[0].kline.close })
                            jsonfile.writeFileSync(resultJsonPath, results);
                    //     }
                    //
                    // }
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports.calculate = calculate;