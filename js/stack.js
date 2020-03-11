"use strict";
export {Stack};

class Stack{
    constructor(){
        this.stack = [];
    }
};

Stack.prototype.pop = function(){
    if(this.stack.length != 0)
        return this.stack.pop();
};

Stack.prototype.push = function(item){
    this.stack.push(item);
};