
let resultJsonPath = __dirname + '/../../result/底部婴儿形态.json';
const jsonfile = require('jsonfile');
jsonfile.writeFileSync(resultJsonPath, []);
const util = require('../../util/Fibonacci');
const macdutil = require('../../util/MACD');

function calculate(data, stock) {
    try {
        data = JSON.parse(data);

        if (data.mashData.length > 160) {

            //计算非布拉切均线
            data = util.generateFibonacci(data);

            if (data.mashData[0].ma144 > data.mashData[0].ma55) {//均线144， 55， 34， 13依次排列
                if (data.mashData[0].ma55 > data.mashData[0].ma34) {
                    if (data.mashData[0].ma34 > data.mashData[0].ma13) {
                        if (data.mashData[0].macd.macd > 0) {//macd红的
                            if (Math.abs(data.mashData[0].ma55 - data.mashData[4].ma55) < 0.06) {//5天内34，55走平
                                if (Math.abs(data.mashData[0].ma34 - data.mashData[4].ma34) < 0.06) {
                                    if (data.mashData[0].ma5['volume'] > data.mashData[0].ma10['volume']) {//5日均量金叉10日均量
                                        if(data.mashData[0].kline.close>data.mashData[0].ma13){
                                            let results = jsonfile.readFileSync(resultJsonPath);
                                            results.push({ "stock": stock, "date": data.mashData[0].date, "price": data.mashData[0].kline.close, "strong":macdutil.findIfGodPointIsAboveZero(data) });
                                            console.log(`insert children ${stock}`);
                                            jsonfile.writeFileSync(resultJsonPath, results);
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
            }

            // if(data.mashData[0].ma144< data.mashData[0].ma55 && data.mashData[0].ma55 < data.mashData[0].ma34 && data.mashData[0].ma34 < data.mashData[0].ma13){
            //     if(data.mashData[0].ma144>data.mashData[1].ma144){//趋势线向上
            //         if(data.mashData[0].ma55>data.mashData[1].ma55){
            //             if(data.mashData[0].ma13>data.mashData[1].ma13){
            //                 let calculated = data.mashData[0].kline.close - data.mashData[0].ma13;
            //                 calculated = calculated / data.mashData[0].kline.close;
            //                 calculated = Math.abs(calculated);
            //                 if(calculated<0.03){//在13天均线附近3个点。
            //                     if(data.mashData[0].macd.macd>0){//macd是红的
            //                         let results = jsonfile.readFileSync(resultJsonPath);
            //                         results.push({ "stock": stock, "date": data.mashData[0].date, "price": data.mashData[0].kline.close });
            //                         console.log(`insert growth ${stock}`);
            //                         jsonfile.writeFileSync(resultJsonPath, results);
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // }
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports.calculate = calculate;