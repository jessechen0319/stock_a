let GetHTMLContent = require('./GetHTMLContent');
let ChainTask = require('task-chain').ChainTask;
let ChainTaskRunner = require('task-chain').ChainTaskRunner;
var jsonfile = require('jsonfile');
let resultJsonPath = "./highQualityStocks.json";
jsonfile.writeFileSync(resultJsonPath, []);

class FetchBasicInformation{
    structure(){
        this.chainTaskRunner = new ChainTaskRunner();
    }

    downloadInformation(name, task) {

        //let chainTaskRunner = new ChainTaskRunner();
        let url = 'http://emweb.securities.eastmoney.com/NewFinanceAnalysis/MainTargetAjax?ctype=4&type=0&code='+name;
        GetHTMLContent.download(url, (data)=>{
            try {
                let jsonData = JSON.parse(data);
                let latestCash = Number(jsonData[0]['mgjyxjl']);
                if(latestCash>0){
                    let secondCash = Number(jsonData[4]['mgjyxjl']);
                    if(secondCash<0 || (latestCash-secondCash)/secondCash > 0.7){
                        if(Number(jsonData[0]['jbmgsy']) > Number(jsonData[4]['jbmgsy'])){
                            //add
                            let results = jsonfile.readFileSync(resultJsonPath);
                            results.push(name);
                            jsonfile.writeFileSync(resultJsonPath, results);
                        }
                    } 
                }
            } catch (error) {
                cocnsole.log(error);
            }
            task.end();
        });
    }

    fetch(){
        let stocks = jsonfile.readFileSync(__dirname+'/stocks.json');
        
        let self = this;
        let chainRunner = new ChainTaskRunner();
    
        stocks.forEach(element => {
            console.log(stocks.length);
            let task = new ChainTask(()=>{
                self.downloadInformation(element, task);
            });
            setTimeout(() => {
                chainRunner.addTask(task);
            }, 50);
        });
    }
}

let test = new FetchBasicInformation();
test.fetch();

// let GetHTMLContent = require('./GetHTMLContent');

// let ChainTask = require('task-chain').ChainTask;
// let ChainTaskRunner = require('task-chain').ChainTaskRunner;

// var jsonfile = require('jsonfile');

// class FetchForStock {
//     structure(){
//         this.analysis = [];
//     }

//     setAnalysis(analysis){
        
//         this.analysis = analysis;
//     }

//     downloadInformation(name, task) {

//         //let chainTaskRunner = new ChainTaskRunner();
//         let url = 'http://emweb.securities.eastmoney.com/NewFinanceAnalysis/MainTargetAjax?ctype=4&type=0&code='+name;
//         GetHTMLContent.download(url, (data)=>{
//             try {
//                 let jsonData = JSON.parse(data);
//                 let latestCash = Number(jsonData[0]['mgjyxjl']);
//                 if(latestCash>0){
//                     let secondCash = Number(jsonData[4]['mgjyxjl']);
//                     if(secondCash<0 || (latestCash-secondCash)/secondCash > 0.4){
//                         if(Number(jsonData[0]['jbmgsy']) > Number(jsonData[4]['jbmgsy'])){
//                             //add
//                             console.log(name);
//                         }
//                     } 
//                 }
//             } catch (error) {
//                 cocnsole.log(error);
//             }
//             task.end();
//         });
//     }

//     fetchStockDetail(callback){
//         let stocks = jsonfile.readFileSync(__dirname+'/stocks.json');
//         let now = new Date();
//         let nowValue = Date.parse(now);
//         let chainTaskRunner = new ChainTaskRunner();
//         let that = this;
//         stocks.forEach((stock, index)=>{
//             //日K
//             //let url = `https://gupiao.baidu.com/api/stocks/stockdaybar?from=pc&os_ver=1&cuid=xxx&vv=100&format=json&stock_code=${stock}&step=3&start=&count=160&fq_type=front&timestamp=${nowValue}`;
//             //周K
//             //et url = 'http://emweb.securities.eastmoney.com/NewFinanceAnalysis/MainTargetAjax?ctype=4&type=0&code='+stock;
//             let task = new ChainTask(()=>{
//                 this.downloadInformation(stock, task);
//             });
//             chainTaskRunner.addTask(task);
//         });
//     }

//     fetchStockName(callback){
//         let now = new Date();
//         let nowValue = Date.parse(now);
//         jsonfile.writeFileSync(__dirname+'/stocks.json', []);
//         let kLineURL = `http://money.finance.sina.com.cn/d/api/openapi_proxy.php/?__s=[[%22hq%22,%22hs_a%22,%22%22,0,1,100]]&callback=analysisTitle`;
//         GetHTMLContent.download(kLineURL, (response)=>{
//             eval(response);
            
//         });

//         function analysisTitle(data){
//             console.log(data[0].count);
//             let urls = [];
//             let maxPage = data[0].count/80 + 1;
//             for(let i = 0; i< maxPage; i++){
//                 let URL = `http://money.finance.sina.com.cn/d/api/openapi_proxy.php/?__s=[[%22hq%22,%22hs_a%22,%22%22,${i},${i+1},80]]&callback=analysisEachPage`;
//                 urls.push(URL);
//             }

//             //fetch each pages after urls ready
//             var taskRunner = new ChainTaskRunner();
//             urls.forEach((url, index)=>{
                
//                 let chainTask = new ChainTask(()=>{
//                     GetHTMLContent.download(url, (response, error)=>{
//                         if(error){
//                             console.error(error);
//                         } else {
//                             eval(response);
//                             if(index == urls.length-1){
//                                 callback(urls);
//                             }
//                         }
//                         chainTask.end();
//                     });
//                 });
//                 taskRunner.addTask(chainTask);
//             });

//             function analysisEachPage(data){
//                 var stocks = jsonfile.readFileSync(__dirname+'/stocks.json');
//                 if(!stocks){
//                     stocks = [];
//                 }
//                 data[0].items.forEach((item)=>{
//                     stocks.push(item[0]);
//                 });
//                 jsonfile.writeFileSync(__dirname+'/stocks.json', stocks);
//             }
//         }
//     }
// }

// module.exports = FetchForStock;

// //test
// let chainRunner = new ChainTaskRunner();
// let fetchForStock = new FetchForStock();
//  let stockNameTask = new ChainTask(()=>{	
//     fetchForStock.fetchStockName(()=>{	
//         stockNameTask.end();	
//     });	
// });	
//  let stockAnalysisTask = new ChainTask(()=>{	
//     fetchForStock.fetchStockDetail(()=>{	
//         stockAnalysisTask.end();	
//     });	
// });

// chainRunner.addTask(stockNameTask);	
// chainRunner.addTask(stockAnalysisTask);
