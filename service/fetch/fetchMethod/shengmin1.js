//5天内144天线波动在4分以内，股价在13天线上方，在144天线下方，13， 34， 55天线多头排列


let resultJsonPath = __dirname + '/../../result/shengmin1.json';
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

function calculate(data, stock){
    try {

        let latestFibonacci = getTheFibonacciDataForLateOne(data);
        let lastRecord = data.mashData.shift();
        if(lastRecord['kline']['close']<latestFibonacci.price144 && lastRecord['kline']['close']>latestFibonacci.price13){
            let fibonacci2 = getTheFibonacciDataForLateOne(data);
            if(latestFibonacci.price13>=fibonacci2.price13 && latestFibonacci.price34 >= fibonacci2.price34 && latestFibonacci.price55 >= fibonacci2.price55){
                //多头排列
                if(Math.abs(latestFibonacci.price144-fibonacci2.price144)<=0.01){
                    var results = jsonfile.readFileSync(resultJsonPath);
                    console.log(`insert rsi ${stock}`);
                    results.push({"stock":stock, "date": data.mashData[0].date, "price": data.mashData[0].kline.close});
                    jsonfile.writeFileSync(resultJsonPath, results);
                }
            }
        }

        


        // data = JSON.parse(data);
        // let rsi1 = data.mashData[0].rsi.rsi1;
        // let rsi2 = data.mashData[0].rsi.rsi2;
        // let rsi3 = data.mashData[0].rsi.rsi3;
        // if(rsi2<30 || rsi3<30){
        //     if(rsi1 > data.mashData[1].rsi.rsi1){
        //         var results = jsonfile.readFileSync(resultJsonPath);
        //         console.log(`insert rsi ${stock}`);
        //         results.push({"stock":stock, "date": data.mashData[0].date, "price": data.mashData[0].kline.close});
        //         jsonfile.writeFileSync(resultJsonPath, results);
        //     }
        // }


    } catch (error) {
        console.log(error);
    }
}

module.exports.calculate = calculate;