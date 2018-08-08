let GetHTMLContent = require('./GetHTMLContent');
let ChainTask = require('task-chain').ChainTask;
let ChainTaskRunner = require('task-chain').ChainTaskRunner;
var jsonfile = require('jsonfile');
let resultJsonPath = "./highQualityStocks.json";
jsonfile.writeFileSync(resultJsonPath, []);

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
        let fetchTask = new ChainTask(() => {
            that.fetch(() => {
                fetchTask.end();
            })
        });
        myTaskRunner.addTask(fetchTask);

        let stocks = jsonfile.readFileSync(__dirname + '/stocks.json');
        let now = new Date();
        let nowLong = Date.parse(now);
        stocks.forEach((item, index) => {
            let task = new ChainTask(() => {
                try {
                    let url = `https://stock.xueqiu.com/v5/stock/chart/kline.json?symbol=${item}&begin=${nowLong}&period=15m&type=before&count=-142&indicator=kline,ma,macd,kdj,boll,rsi,wr,bias,cci,psy`;
                    GetHTMLContent.downloadHttps(url, (data) => {
                        data = JSON.parse(data);
                        for (let i = data.length - 17; i <= data.length - 1; i++) {
                            let analysisData = data[i];
                            let compare1 = data[i - 1];
                            let compare2 = data[i - 2];
                            let compare3 = data[i - 3];

                            let averageAmound = compare1[1] + compare2[1] + compare3[1];
                            averageAmound = averageAmound / 3;

                            if (analysisData[1] > 2 * averageAmound) {
                                let results = jsonfile.readFileSync(shortGoodPath);
                                results.push(item);
                                jsonfile.writeFileSync(shortGoodPath, results);
                                // let shangyinxian = analysisData[3] - analysisData[5];
                                // let zhangE = analysisData[5] - analysisData[2];
                                // if (zhangE > 0) {



                                // }
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

let test = new FetchBasicInformation();
test.fetchBigRed();

