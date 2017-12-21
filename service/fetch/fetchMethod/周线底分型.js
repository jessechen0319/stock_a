//股价连跌15天，要反弹了
//***大盘 */
let resultJsonPath = __dirname + '/../../result/周线底分型.json';
const util = require('../../util/Fibonacci');
const jsonfile = require('jsonfile');
jsonfile.writeFileSync(resultJsonPath, []);

function processCover(data){

    let processedArray = [];

    for(let i = 0; i < 10 ; i++){
        processedArray.push(data.mashData[i].kline);
    }

    let cursor = 8;

    while(cursor > 0){

        let before = processedArray[cursor];
        let after = processedArray[cursor-1];
        let isCover = false;
        let high = after.high, low = after.low;
        if(before.high > after.high && before.low < after.low){
            isCover = true;
        } else if (before.high < after.high && before.low > after.low){
            isCover = true;
        }

        if(isCover){
            if(processedArray[cursor+1].high < after.high){
                //上升
                high = Math.max(before.high , after.high);
                low = Math.max(before.low , after.low);
            } else {
                //下降
                high = Math.min(before.high , after.high);
                low = Math.min(before.low , after.low);
            }
            processedArray[cursor-1].high = high;
            processedArray[cursor-1].low = low;
            processedArray[cursor].removeable = true;
        }
        cursor--;
    }

    let returnValue = [];
    processedArray.forEach((item)=>{
        if(!item.removeable){
            returnValue.push(item);
        }
    });
    return returnValue;
}

function calculate(data, stock){
    try {
        data = JSON.parse(data);
        if (data.mashData.length > 155) {

            let processedCover = processCover(data);
            //确定底分型
            let right = processedCover[0];
            let middle = processedCover[1];
            let left = processedCover[2];

            if(middle.low < right.low && middle.high < right.high){
                if(middle.low < left.low && middle.high < left.high){
                    let lengthOfMiddle = middle.high - middle.low;
                    if(middle.high - middle.close < middle.close - middle.low){
                        if(right.close*2>(left.low + left.high)){
                            let results = jsonfile.readFileSync(resultJsonPath);
                            results.push({ "stock": stock, "date": data.mashData[0].date, "price": data.mashData[0].kline.close });
                            console.log(`insert di weekly ${stock}`);
                            jsonfile.writeFileSync(resultJsonPath, results);
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