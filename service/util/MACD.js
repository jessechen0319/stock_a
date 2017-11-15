function findIfGodPointIsAboveZero(data){
    if(data.mashData[0].macd.macd>0){
        let found = false;
        let isAboveZero = false;
        for(let i = 0; i < data.mashData.length;i++){
            if(data.mashData[i].macd.macd<0){
                if(!found){
                    if(data.mashData[i].macd.dea>0){
                        isAboveZero = true;
                    }
                }
            }
        }
        return isAboveZero;
    } else{
        return false;
    }
}

exports.findIfGodPointIsAboveZero = findIfGodPointIsAboveZero;