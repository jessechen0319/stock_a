class IndexHandler{
    constructor(){
        this.container = $("#resultContainer");
    }

    event_handle_144(){
        let that = this;
        that.container.children().remove();
        that.container.append("<tr><th>编号</th><th>股票代码</th></tr>");
        
        $.get("result/day144").then((data)=>{
            
            data.forEach((element, index) => {
                that.container.append("<tr><td>"+(index+1)+"</td><td>"+element["stock"]+"</td></tr>");
            });
        });
    }
}