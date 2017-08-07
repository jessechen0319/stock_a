let GetHTMLContent = require('./GetHTMLContent');

let ChainTask = require('task-chain').ChainTask;
let ChainTaskRunner = require('task-chain').ChainTaskRunner;

var jsonfile = require('jsonfile');

class FetchForStock {
    structure(){

    }

    fetchStockName(callback){
        let now = new Date();
        let nowValue = Date.parse(now);
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

let fetchForStock = new FetchForStock();
fetchForStock.fetchStockName(()=>{
    
});