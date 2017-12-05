
let resultJsonPath = __dirname + '/../../result/均线黏合股价向上.json';
const jsonfile = require('jsonfile');
jsonfile.writeFileSync(resultJsonPath, []);

const util = require('../../util/Fibonacci');

function calculate(data, stock){
    try {
        data = JSON.parse(data);

        if(data.mashData.length>160){

            //计算非布拉切均线
            data = util.generateFibonacci(data);
            
            let charge = (data.mashData[0].ma144 -data.mashData[0].kline.close)/data.mashData[0].kline.close;

            if(charge>=0.02){
                if(Math.abs(data.mashData[0].ma144 - data.mashData[4].ma144)<=0.05){
                    if(Math.abs((data.mashData[0].ma13 -data.mashData[0].ma55)/data.mashData[0].kline.close) <=0.005){
                        if(Math.abs((data.mashData[0].ma34 -data.mashData[0].ma55)/data.mashData[0].kline.close) <=0.005){
                            if(data.mashData[0].kline.close>data.mashData[0].ma13){
                                if(data.mashData[0].kline.close>data.mashData[0].ma34){
                                    if(data.mashData[0].kline.close>data.mashData[0].ma55){
                                        if(data.mashData[0].kline.close>data.mashData[0].kline.open){
                                            if(data.mashData[0].kline.volume>1.5*data.mashData[1].kline.volume){
                                                var results = jsonfile.readFileSync(resultJsonPath);
                                                results.push({ "stock": stock, "strategy": "3线黏合股价向上", "date": data.mashData[0].date, "price": data.mashData[0].kline.close });
                                                console.log(`insert growth ${stock}`);
                                                jsonfile.writeFileSync(resultJsonPath, results);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if(Math.abs((data.mashData[0].ma144 -data.mashData[0].ma13)/data.mashData[0].kline.close) <=0.005){
                        if(Math.abs((data.mashData[0].ma55 -data.mashData[0].ma13)/data.mashData[0].kline.close) <=0.005){
                            if(Math.abs((data.mashData[0].ma34 -data.mashData[0].ma13)/data.mashData[0].kline.close) <=0.005){
                                if(data.mashData[0].kline.close>data.mashData[0].ma13){
                                    if(data.mashData[0].kline.close>data.mashData[0].ma34){
                                        if(data.mashData[0].kline.close>data.mashData[0].ma55){
                                            if(data.mashData[0].kline.close>data.mashData[0].ma144){
                                                if(data.mashData[0].kline.close>data.mashData[0].kline.open){
                                                    if(data.mashData[0].kline.volume>1.5*data.mashData[1].kline.volume){
                                                        var results = jsonfile.readFileSync(resultJsonPath);
                                                        results.push({ "stock": stock, "strategy": "3线黏合股价向上", "date": data.mashData[0].date, "price": data.mashData[0].kline.close });
                                                        console.log(`insert growth ${stock}`);
                                                        jsonfile.writeFileSync(resultJsonPath, results);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // if(data.mashData[0].ma144 > data.mashData[1].ma144){//144均线向上
            //     if(data.mashData[0].ma144< data.mashData[0].ma55 && data.mashData[0].ma55 < data.mashData[0].ma34 && data.mashData[0].ma34 < data.mashData[0].ma13){//均线多头排列
            //         let calculated = data.mashData[0].kline.close-data.mashData[0].ma13;
            //         calculated = calculated/data.mashData[0].kline.close;
            //         calculated = Math.abs(calculated);
            //         if(calculated < 0.01){//股价在13天线附近
            //             var results = jsonfile.readFileSync(resultJsonPath);
            //             results.push({"stock":stock, "strategy":"多头排列，股价不高", "date": data.mashData[0].date, "price": data.mashData[0].kline.close});
            //             console.log(`insert growth ${stock}`);
            //             jsonfile.writeFileSync(resultJsonPath, results);

            //         }
            //     }
            // }

            
        }

       
    } catch (error) {
        console.log(error)
    }
        
}

module.exports.calculate = calculate;