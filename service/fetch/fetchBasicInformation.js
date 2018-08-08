let GetHTMLContent = require('./GetHTMLContent');
let ChainTask = require('task-chain').ChainTask;
let ChainTaskRunner = require('task-chain').ChainTaskRunner;
var jsonfile = require('jsonfile');

class FetchBasicInformation{
    structure(){
        this.chainTaskRunner = new ChainTaskRunner();
    }

    downloadInformation(name) {

        //let chainTaskRunner = new ChainTaskRunner();
        let url = 'http://emweb.securities.eastmoney.com/NewFinanceAnalysis/MainTargetAjax?ctype=4&type=0&code='+name;
        GetHTMLContent.download(url, (data)=>{
            try {
                let jsonData = JSON.parse(data);
                let latestCash = Number(jsonData[0]['mgjyxjl']);
                if(latestCash>0){
                    let secondCash = Number(jsonData[4]['mgjyxjl']);
                    if(secondCash<0 || (latestCash-secondCash)/secondCash > 0.4){
                        if(Number(jsonData[0]['jbmgsy']) > Number(jsonData[4]['jbmgsy'])){
                            //add
                            console.log(name);
                        }
                    } 
                }
            } catch (error) {
                cocnsole.log(error);
            }
        });
    }

    fetch(){
        let stocks = jsonfile.readFileSync(__dirname+'/stocks.json');
        
        let self = this;
    
        stocks.forEach(element => {
            let task = new ChainTask(()=>{
                self.downloadInformation(element);
            });
            self.chainTaskRunner.addTask(task);
        });
    }
}

let test = new FetchBasicInformation();
test.fetch();