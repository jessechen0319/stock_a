//5日均线，10日均线，20日均线，多头排列
let resultJsonPath = __dirname + '/../../result/growth5_10_20.json';
const jsonfile = require('jsonfile');
function calculate(data, stock){
    try {
        data = JSON.parse(data);
        let ma5P1 = data.mashData[0].ma5.avgPrice;
        let ma5P2 = data.mashData[3].ma5.avgPrice;
        let ma10P1 = data.mashData[0].ma10.avgPrice;
        let ma10P2 = data.mashData[3].ma10.avgPrice;
        let ma20P1 = data.mashData[0].ma20.avgPrice;
        let ma20P2 = data.mashData[3].ma20.avgPrice;

        if(ma5P1>ma5P2){
            if(ma10P1>ma10P2){
                if(ma20P1>ma20P2){
                    if(data.mashData[0].kline.close<ma10P1){
                        var results = jsonfile.readFileSync(resultJsonPath);
                        results.push({"stock":stock, "date": data.mashData[0].date, "price": data.mashData[0].kline.close});
                        console.log(`insert growth ${stock}`);
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