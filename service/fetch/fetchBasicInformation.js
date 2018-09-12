let GetHTMLContent = require('./GetHTMLContent');
let ChainTask = require('task-chain').ChainTask;
let ChainTaskRunner = require('task-chain').ChainTaskRunner;
var jsonfile = require('jsonfile');
let resultJsonPath = "./highQualityStocks.json";


class FetchBasicInformation {
    structure() {
        this.chainTaskRunner = new ChainTaskRunner();
        this.title = "";
        this.processor = 0;
    }

    downloadInformation(name, task, callback) {

        //let chainTaskRunner = new ChainTaskRunner();
        let url = 'http://emweb.securities.eastmoney.com/NewFinanceAnalysis/MainTargetAjax?ctype=4&type=0&code=' + name;
        GetHTMLContent.download(url, (data) => {
            try {
                let jsonData = JSON.parse(data);
                let latestCash = Number(jsonData[0]['mgjyxjl']);
                if (latestCash > 0) {
                    let secondCash = Number(jsonData[4]['mgjyxjl']);
                    if (secondCash < 0 || (latestCash - secondCash) / secondCash > 0.7) {
                        if (Number(jsonData[0]['jbmgsy']) > Number(jsonData[4]['jbmgsy'])) {
                            //add
                            let results = jsonfile.readFileSync(resultJsonPath);
                            results.push(name);
                            jsonfile.writeFileSync(resultJsonPath, results);
                        }
                    }
                }
            } catch (error) {
                console.log(error);
            }
            task.end();
            if (callback) {
                callback.call();
            }
        });
    }

    fetch(callback) {
        let stocks = jsonfile.readFileSync(__dirname + '/stocks.json');
        jsonfile.writeFileSync(resultJsonPath, []);
        let self = this;
        let chainRunner = new ChainTaskRunner();

        stocks.forEach((element, index) => {
            console.log(stocks.length);
            let task = new ChainTask(() => {
                if (index == stocks.length - 1) {
                    self.downloadInformation(element, task, callback);
                } else {
                    self.downloadInformation(element, task);
                }
            });
            setTimeout(() => {
                chainRunner.addTask(task);
            }, 50);
        });
    }

    // below is fetch methods for good stocks
    //有放量实体阳线出来
    //https://stock.xueqiu.com/v5/stock/chart/kline.json?symbol=SH601677&begin=1533763502919&period=15m&type=before&count=-142&indicator=kline,ma,macd,kdj,boll,rsi,wr,bias,cci,psy

    fetchBigRed() {
        let myTaskRunner = new ChainTaskRunner();
        let that = this;
        let shortGoodPath = './goodShort.json';
        jsonfile.writeFileSync(shortGoodPath, []);
        // let fetchTask = new ChainTask(() => {
        //     that.fetch(() => {
        //         fetchTask.end();
        //     })
        // });
        // myTaskRunner.addTask(fetchTask);

        let stocks = jsonfile.readFileSync(__dirname + '/highQualityStocks.json');
        let now = new Date();
        let nowLong = Date.parse(now);
        stocks.forEach((item, index) => {
            let task = new ChainTask(() => {
                try {
                    //https://ex.sina.com.cn/quotes_service/api/jsonp_v2.php/var%20_sh601677_15_1533776648805=/CN_MarketData.getKLineData?symbol=sh601677&scale=15&ma=no&datalen=1023
                    let url = `https://ex.sina.com.cn/quotes_service/api/jsonp_v2.php/var%20_${item}_15_${nowLong}=/CN_MarketData.getKLineData?symbol=${item}&scale=15&ma=no&datalen=1023`;
                    
                    GetHTMLContent.downloadHttps(url, (data) => {

                        let string1 = data.split("=")[1];
                        let string2 = string1.substr(1, string1.length - 2);
                        string2 = "data = " + string2;
                        eval(string2);
                        //data = JSON.parse(string2);
                        //console.log(data);

                        let inserted = false;
                        for (let i = data.length - 17; i <= data.length - 1; i++) {
                            let analysisData = data[i];
                            let compare1 = data[i - 1];
                            let compare2 = data[i - 2];
                            let compare3 = data[i - 3];

                            let averageAmound = Number(compare1["volume"]) + Number(compare2["volume"]) + Number(compare3["volume"]);
                            averageAmound = averageAmound / 3;
                            

                            if (Number(analysisData["volume"]) > 3 * averageAmound) {

                                let shangyinxian = Number(analysisData['high']) - Number(analysisData['close']);
                                let zhangE = Number(analysisData['close']) -Number( analysisData['open']);
                                console.log(shangyinxian);
                                console.log(zhangE);
                                console.log(shangyinxian / zhangE < 0.2);
                                if (zhangE > 0 && zhangE/analysisData['open'] > 0.02) {
                                    if (shangyinxian / zhangE < 0.2 && !inserted) {
                                        console.log(`good for ${item}`);
                                        let insertObj = {};
                                        insertObj.name=item;
                                        insertObj.time=analysisData['day'];
                                        let results = jsonfile.readFileSync(shortGoodPath);
                                        results.push(insertObj);
                                        jsonfile.writeFileSync(shortGoodPath, results);
                                        inserted = true;
                                    }
                                }
                            }
                        }
                        task.end();
                    });
                } catch (error) {
                    console.error(error);
                }
            });
            myTaskRunner.addTask(task);
        });

    }


}

module.exports = FetchBasicInformation;