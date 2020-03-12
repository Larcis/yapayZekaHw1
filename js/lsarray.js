"use strict";
export {LsArray};


class LsArray{
    constructor(){
        this.stack = [];
    }
};

LsArray.prototype.pop_min = function(){
    let min = Number.MAX_VALUE;
    let idx = -1
    let i = this.stack.length+1;
    while(--i){
        if(this.stack[i-1].cost < min){
            min = this.stack[i-1].cost;
            idx = i-1;
        }
    }
    /*for(let i = 0; i < this.stack.length; i++){
        if(this.stack[i] < min){
            min = this.stack[i];
            idx = i;
        }
    }*/
    if(idx != -1){
        let val = this.stack[idx];
        this.stack.splice(idx, idx);
        return val;
    }
    return undefined;
};

LsArray.prototype.insert = function(item){
    this.stack.push(item);
};

LsArray.prototype.clear = function(){
    this.stack = [];
};

LsArray.prototype.empty = function(){
    return this.stack.length == 0;
};

LsArray.prototype.type = function(){
    return "LSarray";
};