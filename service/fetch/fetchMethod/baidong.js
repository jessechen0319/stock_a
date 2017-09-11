//摆动指标10天内两次以上下穿超买线

let resultJsonPath = __dirname + '/../../result/baidong.json';
const jsonfile = require('jsonfile');

function getTheFibonacciDataForLateOne(list){
    let price144=0, price55=0, price34=0, price13=0;
    if(list.mashData.length>=144){
        let totalPrice144 = 0;
        let totalPrice55 = 0;
        let totalPrice34 = 0;
        let totalPrice13 = 0;
        for(let i = 0; i<144; i++){
            totalPrice144 += list.mashData[i]['kline']['close'];
        }
        for(let i = 0; i<55; i++){
            totalPrice55 += list.mashData[i]['kline']['close'];
        }
        for(let i = 0; i<34; i++){
            totalPrice34 += list.mashData[i]['kline']['close'];
        }
        for(let i = 0; i<13; i++){
            totalPrice13 += list.mashData[i]['kline']['close'];
        }

        return {"price13":totalPrice13/13, "price34": totalPrice34/34, "price55": totalPrice55/55, "price144": totalPrice144/144};
    }
}

function generateBaidong(data){
    if(data.mashData.length<50){
        return null;
    } else {
        let mashDataList = data.mashData;
        for(let index = mashDataList.length-3; index>=0; index--){
            //MA(SMA(MAX(CLOSE-REF(CLOSE,1),0),2,1)/SMA(ABS(CLOSE-REF(CLOSE,1)),2,1)*100,3);
            //MAX(CLOSE-REF(CLOSE,1)
            let thisClose = mashDataList[index]['kline']['close'];
            let previousClose = mashDataList[index+1]['kline']['close'];
            let param1 = thisClose-previousClose>0?thisClose-previousClose:0;
            //SAM(x, n, m) = (m*x + (n-m)*y_)/n
            //param2 = SAM(param1, 2, 1)
            let y_ = 0;
            let y_2 = 0;
            if(index == mashDataList.length-3){
                y_ = 0;
                y_2 = 0;
            } else {
                y_ =  mashDataList[index+1].y;
                y_2 =  mashDataList[index+1].y2;
            }

            let y =(param1 + y_)/2;
            mashDataList[index]['y']=y;
            
            let param3 = Math.abs(mashDataList[index]['kline']['close']-mashDataList[index+1]['kline']['close']);
            let y2 =(param3 + y_2)/2;
            mashDataList[index]['y2']=y2;
            let param4 = y/y2;
            param4 = param4*100;
            mashDataList[index]['o1']=param4;
            let o11 = 0 , o12 = 0;
            if(mashDataList[index+1]['o1']&&mashDataList[index+2]['o1']){
                o11 = mashDataList[index+1]['o1'];
                o12 = mashDataList[index+1]['o1'];
            }
            mashDataList[index]['baidong'] = (param4+o11+o12)/3;
        }
        data.mashData = mashDataList;
        return data;
    }
}

function calculate(data, stock){
    try {
        data = JSON.parse(data);
        let jesseData = data;
        if(data.mashData.length>80){
            jesseData = generateBaidong(data);
            let isOK1 = false;
            let isOK2 = false;
            for(let i = 0; i<10; i++){
                if(jesseData.mashData[i].baidong<25 && jesseData.mashData[i+1].baidong>25){
                    if(isOK1){
                        isOK2 = true;
                    } else {
                        isOK1 = true;
                    }
                }
            }

            if(isOK1 && isOK2){
                var results = jsonfile.readFileSync(resultJsonPath);
                console.log(`insert baidong ${stock}`);
                results.push({"stock":stock, "date": data.mashData[0].date, "price": data.mashData[0].kline.close});
                jsonfile.writeFileSync(resultJsonPath, results);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports.calculate = calculate;