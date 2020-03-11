"use strict";
export {LsArray};

class LsArray{
    constructor(){
        this.stack = [];
    }
};

LsArray.prototype.pop_min = function(){
    let min = MAX_INT;
    let idx = -1
    for(let i = 0; i < this.stack.length; i++){
        if(this.stack[i] < min){
            min = this.stack[i];
            idx = i;
        }
    }
    if(idx != -1){
        let val = this.stack[idx];
        this.stack.splice(idx, idx);
        return val;
    }
    return undefined;
};

LsArray.prototype.push = function(item){
    this.stack.push(item);
};