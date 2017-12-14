let GetHTMLContent = require('./GetHTMLContent');

let ChainTask = require('task-chain').ChainTask;
let ChainTaskRunner = require('task-chain').ChainTaskRunner;

var jsonfile = require('jsonfile');

class FetchForStock {
    structure(){
        this.analysis = [];
    }

    setAnalysis(analysis){
        
        this.analysis = analysis;
    }

    fetchStockDetail(callback){
        let stocks = jsonfile.readFileSync(__dirname+'/stocks.json');
        let now = new Date();
        let nowValue = Date.parse(now);
        let chainTaskRunner = new ChainTaskRunner();
        let that = this;
        stocks.forEach((stock, index)=>{
            //日K
            let url = `https://gupiao.baidu.com/api/stocks/stockdaybar?from=pc&os_ver=1&cuid=xxx&vv=100&format=json&stock_code=${stock}&step=3&start=&count=160&fq_type=front&timestamp=${nowValue}`;
            //周K
            //let url = `https://gupiao.baidu.com/api/stocks/stockweekbar?from=pc&os_ver=1&cuid=xxx&vv=100&format=json&stock_code=${stock}&step=3&start=&count=160&fq_type=front&timestamp=${nowValue}`;
            let task = new ChainTask(()=>{
                GetHTMLContent.downloadHttps(url, (response)=>{
                    if(that.analysis && that.analysis.length >0){
                        that.analysis.forEach((analysisor)=>{
                            analysisor.call(this, response, stock);
                        });
                    }

                    setTimeout(()=>{
                        if(index == stocks.length-1){
                            callback();
                        }
                        task.end();
                    }, 150);
                });
            });
            chainTaskRunner.addTask(task);
        });
    }

    fetchStockName(callback){
        let now = new Date();
        let nowValue = Date.parse(now);
        jsonfile.writeFileSync(__dirname+'/stocks.json', []);
        let kLineURL = `http://money.finance.sina.com.cn/d/api/openapi_proxy.php/?__s=[[%22hq%22,%22hs_a%22,%22%22,0,1,100]]&callback=analysisTitle`;
        GetHTMLContent.download(kLineURL, (response)=>{
            eval(response);
            
        });

        function analysisTitle(data){
            console.log(data[0].count);
            let urls = [];
            let maxPage = data[0].count/80 + 1;
            for(let i = 0; i< maxPage; i++){
                let URL = `http://money.finance.sina.com.cn/d/api/openapi_proxy.php/?__s=[[%22hq%22,%22hs_a%22,%22%22,${i},${i+1},80]]&callback=analysisEachPage`;
                urls.push(URL);
            }

            //fetch each pages after urls ready
            var taskRunner = new ChainTaskRunner();
            urls.forEach((url, index)=>{
                
                let chainTask = new ChainTask(()=>{
                    GetHTMLContent.download(url, (response, error)=>{
                        if(error){
                            console.error(error);
                        } else {
                            eval(response);
                            if(index == urls.length-1){
                                callback(urls);
                            }
                        }
                        chainTask.end();
                    });
                });
                taskRunner.addTask(chainTask);
            });

            function analysisEachPage(data){
                var stocks = jsonfile.readFileSync(__dirname+'/stocks.json');
                if(!stocks){
                    stocks = [];
                }
                data[0].items.forEach((item)=>{
                    stocks.push(item[0]);
                });
                jsonfile.writeFileSync(__dirname+'/stocks.json', stocks);
            }
        }
    }
}

module.exports = FetchForStock;

let fetchForStock = new FetchForStock();

//rsiLessThan20

let rsiLessThan20 = require('./fetchMethod/rsiLessThan20');
let growth5_10_20 = require('./fetchMethod/growth5_10_20');
let shengmin1 = require('./fetchMethod/shengmin1');
let shengmin1_restriction = require('./fetchMethod/shengmin1_restriction');
let shengmin2 = require('./fetchMethod/shengmin2');
let shengmin3 = require('./fetchMethod/shengmin3');
let baidong = require('./fetchMethod/baidong');
let liandie15tian = require('./fetchMethod/连跌15天');
let biji144up = require('./fetchMethod/均线逼近144向上');
let upwith13 = require('./fetchMethod/沿着13天线爬');
let nianhe = require('./fetchMethod/均线黏合股价向上');

let children = require('./fetchMethod/底部婴儿形态');
let boom = require('./fetchMethod/起爆点');
let growth144_55 = require('./fetchMethod/day144_55_向上');

let dragon = require('./fetchMethod/潜龙吸水');


fetchForStock.setAnalysis([dragon.calculate]);

let chainRunner = new ChainTaskRunner();

let stockNameTask = new ChainTask(()=>{
    fetchForStock.fetchStockName(()=>{
        stockNameTask.end();
    });
});

let stockAnalysisTask = new ChainTask(()=>{
    fetchForStock.fetchStockDetail(()=>{
        stockAnalysisTask.end();
    });
});

chainRunner.addTask(stockNameTask);
chainRunner.addTask(stockAnalysisTask);
