let GetHTMLContent = require('./GetHTMLContent');
let ChainTask = require('task-chain').ChainTask;
let ChainTaskRunner = require('task-chain').ChainTaskRunner;
var jsonfile = require('jsonfile');

class FetchBasicInformation{
    structure(){

    }

    downloadInformation(name) {

        //let chainTaskRunner = new ChainTaskRunner();
        let url = 'http://emweb.securities.eastmoney.com/NewFinanceAnalysis/MainTargetAjax?ctype=4&type=0&code='+name;
        GetHTMLContent.download(url, (data)=>{
            console.log(data);
        });
    }
}

let test = new FetchBasicInformation();
test.downloadInformation('sh601677');