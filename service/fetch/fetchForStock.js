let GetHTMLContent = require('./GetHTMLContent');

let ChainTask = require('task-chain').ChainTask;
let ChainTaskRunner = require('task-chain').ChainTaskRunner;

var jsonfile = require('jsonfile');

class FetchForStock {
    structure(){

    }

    setAnalysis(analysis){
        if(!this.analysis){
            this.analysis = [];
        }

        this.analysis.push(analysis);
    }

    fetchStockDetail(callback){
        let stocks = jsonfile.readFileSync(__dirname+'/stocks.json');
        let now = new Date();
        let nowValue = Date.parse(now);
        let chainTaskRunner = new ChainTaskRunner();
        let that = this;
        stocks.forEach((stock, index)=>{
            let url = `https://gupiao.baidu.com/api/stocks/stockdaybar?from=pc&os_ver=1&cuid=xxx&vv=100&format=json&stock_code=${stock}&step=3&start=&count=160&fq_type=front&timestamp=${nowValue}`;
            console.log(`process for stock <<< ${stock}`);//TODO delete this one
            let task = new ChainTask(()=>{
                GetHTMLContent.download(url, (response)=>{
                    if(that.analysis && that.analysis.length >0){
                        that.analysis.forEach((analysisor)=>{
                            analysisor.apply(this, response, stock);
                        });
                    }

                    setTimeout(()=>{
                        if(index == stocks.length-1){
                            callback();
                        }
                        task.end();
                    }, 500);
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
            let maxPage = data[0].count/40 + 1;
            for(let i = 0; i< maxPage; i++){
                let URL = `http://money.finance.sina.com.cn/d/api/openapi_proxy.php/?__s=[[%22hq%22,%22hs_a%22,%22%22,${i},${i+1},40]]&callback=analysisEachPage`;
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
                    console.log(item[0]);
                    stocks.push(item[0]);
                });
                console.log(`stocks length --->>> ${stocks.length}`)
                jsonfile.writeFileSync(__dirname+'/stocks.json', stocks);
            }
        }
    }
}

module.exports = FetchForStock;

let fetchForStock = new FetchForStock();

fetchForStock.setAnalysis((data, stock)=>{

    if(data&&data.errorNo==0&&data.mashData&&data.mashData[0].rsi&&data.mashData[0].rsi.rsi1){
        let rsi1 = data.mashData[0].rsi.rsi1;
        let rsi2 = data.mashData[0].rsi.rsi2;
        let rsi3 = data.mashData[0].rsi.rsi3;
        if(rsi3 < rsi2 && rsi2 < rsi1 && rsi3 <22 && rsi2 < 35){
            console.log(`${stock} match rsi policy with ${rsi1} - ${rsi2} - ${rsi3}`);
        }
    }
});

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
