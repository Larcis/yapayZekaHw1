"use strict";

class LsArray{
    constructor(){
        this.stack = [];
    }
};

LsArray.prototype.pop_min = function(){
    let min = this.stack[0].cost;
    let idx = 0;
    let i = this.stack.length;
    while(--i){
        if(this.stack[i].cost < min){
            min = this.stack[i].cost;
            idx = i;
        }
    }
    let val = this.stack[idx];
    this.stack.splice(idx, 1);
    return val;
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

LsArray.prototype.size = function(){
    return this.stack.length;
};