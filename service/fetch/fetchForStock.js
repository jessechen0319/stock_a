let GetHTMLContent = require('./GetHTMLContent');

class FetchForStock {
    structure(){

    }

    fetchStockName(){
        let now = new Date();
        let nowValue = Date.parse(now);
        let kLineURL = `http://money.finance.sina.com.cn/d/api/openapi_proxy.php/?__s=[[%22hq%22,%22hs_a%22,%22%22,0,1,100]]&callback=analysisTitle`;
        GetHTMLContent(kLineURL, (data)=>{
            console.log(data);
        });
    }
}

let fetchForStock = new FetchForStock();
fetchForStock.fetchStock();