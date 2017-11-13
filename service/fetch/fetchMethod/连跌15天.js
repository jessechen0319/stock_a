//股价连跌15天，要反弹了
let resultJsonPath = __dirname + '/../../result/连跌15天.json';
const jsonfile = require('jsonfile');
jsonfile.writeFileSync(resultJsonPath, []);
function calculate(data, stock){
    try {
        data = JSON.parse(data);
        let ma5P1 = data.mashData[0].ma5.avgPrice;
        let ma5P2 = data.mashData[3].ma5.avgPrice;
        let ma10P1 = data.mashData[0].ma10.avgPrice;
        let ma10P2 = data.mashData[3].ma10.avgPrice;
        let ma20P1 = data.mashData[0].ma20.avgPrice;
        let ma20P2 = data.mashData[3].ma20.avgPrice;

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

        let isAcceptable = true;

        for(let i = 0; i < 8 ; i++){
            if(data.mashData[i].kline.close>data.mashData[i+1].kline.close){
                isAcceptable = false;
            }
        }

        if(isAcceptable){
            let results = jsonfile.readFileSync(resultJsonPath);
            results.push({"stock":stock, "date": data.mashData[0].date, "price": data.mashData[0].kline.close});
            console.log(`insert 连跌15天 ${stock}`);
            jsonfile.writeFileSync(resultJsonPath, results);
        }

    } catch (error) {
        console.log(error)
    }
        
}

module.exports.calculate = calculate;