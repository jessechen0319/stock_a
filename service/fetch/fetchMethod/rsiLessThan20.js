//任何一个rsi的值小于30并且rsi1是增长状态
//改成20
let resultJsonPath = __dirname + '../../result/rsiLessThan20.json';
const jsonfile = require('jsonfile');
function calculate(data, stock){
    if(data&&data.errorNo==0&&data.mashData&&data.mashData[0].rsi&&data.mashData[0].rsi.rsi1){
        let rsi1 = data.mashData[0].rsi.rsi1;
        let rsi2 = data.mashData[0].rsi.rsi2;
        let rsi3 = data.mashData[0].rsi.rsi3;
        if(rsi2<30 || rsi3<30){
            if(rsi1 > data.mashData[1].rsi.rsi1){
                var results = jsonfile.readFileSync(resultJsonPath);
                results.push({"stock":stock, "date": data.mashData[0].date, "price": data.mashData[0].kline.close});
                jsonfile.writeFileSync(resultJsonPath, results);
            }
        }
    }
}

module.exports.calculate = calculate;