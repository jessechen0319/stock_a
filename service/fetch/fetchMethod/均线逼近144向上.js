
let resultJsonPath = __dirname + '/../../result/均线逼近144向上.json';
const jsonfile = require('jsonfile');
jsonfile.writeFileSync(resultJsonPath, []);

function generateFibonacci(data){
    data.mashData.forEach(function(element, index){
        if(index<data.mashData.length-13){
            let price13 = 0;
            for(let i = 0; i < 13; i++){
                price13 += data.mashData[index+i];
            }
            data.mashData[index].ma13 = price13/13;
        }

        if(index<data.mashData.length-34){
            let price34 = 0;
            for(let i = 0; i < 34; i++){
                price34 += data.mashData[index+i];
            }
            data.mashData[index].ma34 = price34/13;
        }
        if(index<data.mashData.length-55){
            let price55 = 0;
            for(let i = 0; i < 55; i++){
                price55 += data.mashData[index+i];
            }
            data.mashData[index].ma55 = price55/13;
        }

        if(index<data.mashData.length-144){
            let price144 = 0;
            for(let i = 0; i < 144; i++){
                price144 += data.mashData[index+i];
            }
            data.mashData[index].ma144 = price144/13;
        }
    });
}

function calculate(data, stock){
    try {
        data = JSON.parse(data);

        if(data.mashData.length>160){

            //计算非布拉切均线
            generateFibonacci(data);

            if(data.mashData[0].ma144 > data.mashData[1].ma144){//144均线向上
                if(data.mashData[0].ma144< data.mashData[0].ma55 && data.mashData[0].ma55 < data.mashData[0].ma34 && data.mashData[0].ma34 < data.mashData[0].ma13){//均线多头排列
                    let calculated = data.mashData[0].kline.close-data.mashData[0].ma13;
                    calculate = calculate/data.mashData[0].kline.close;
                    calculate = Math.abs(calculate);
                    if(calculate < 0.02){//股价在13天线附近
                        var results = jsonfile.readFileSync(resultJsonPath);
                        results.push({"stock":stock, "date": data.mashData[0].date, "price": data.mashData[0].kline.close});
                        console.log(`insert growth ${stock}`);
                        jsonfile.writeFileSync(resultJsonPath, results);

                    }
                }
            }

            
        }

        // let ma5P1 = data.mashData[0].ma5.avgPrice;
        // let ma5P2 = data.mashData[3].ma5.avgPrice;
        // let ma10P1 = data.mashData[0].ma10.avgPrice;
        // let ma10P2 = data.mashData[3].ma10.avgPrice;
        // let ma20P1 = data.mashData[0].ma20.avgPrice;
        // let ma20P2 = data.mashData[3].ma20.avgPrice;

        // if(ma5P1>ma5P2){
        //     if(ma10P1>ma10P2){
        //         if(ma20P1>ma20P2){
        //             if(data.mashData[0].kline.close<ma10P1){
        //                 var results = jsonfile.readFileSync(resultJsonPath);
        //                 results.push({"stock":stock, "date": data.mashData[0].date, "price": data.mashData[0].kline.close});
        //                 console.log(`insert growth ${stock}`);
        //                 jsonfile.writeFileSync(resultJsonPath, results);
        //             }
        //         }
        //     }
        // }
    } catch (error) {
        console.log(error)
    }
        
}

module.exports.calculate = calculate;