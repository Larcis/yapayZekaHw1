"use strict";

class Heap{
    constructor(){
        this.heap = [];
    }
};

Heap.prototype.insert = function(obj){
    this.heap.push(obj);
    this.up_heapify();
}

Heap.prototype.pop_min = function(){
    if(this.heap.length > 0){
        this.swap(0, this.heap.length-1);
        let min = this.heap.pop();
        this.down_heapify(0);
        return min;
    }
}

Heap.prototype.look_min = function(){
    if(this.heap.length > 0)
        return this.heap[0];
}

Heap.prototype.up_heapify = function(){
    let idx = this.heap.length - 1;
    while(idx != 0 && this.is_greater(this.parent(idx), idx)){
        this.swap(this.parent(idx), idx);
        idx = this.parent(idx);
    }
}

Heap.prototype.is_greater = function(i, j){
    return this.heap[i].cost > this.heap[j].cost;
}

Heap.prototype.down_heapify = function(idx){
    let l = this.left_child(idx);
    let r = this.right_child(idx);
    let min = idx;
    if (l < this.heap.length && this.is_greater(idx, l)) 
        min = l; 
    if (r < this.heap.length && this.is_greater(min, r)) 
        min = r; 
    if (min != idx) { 
        this.swap(idx, min);
        this.down_heapify(min);
    } 
}

Heap.prototype.left_child = function(idx){
    return 2 * idx + 1;   
}

Heap.prototype.right_child = function(idx){
    return 2 * idx + 2;   
}

Heap.prototype.parent = function(idx){
    return Math.floor((idx - 1) / 2);   
}

Heap.prototype.swap = function(i, j){
    let tmp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = tmp;   
}

Heap.prototype.clear = function(){
    this.heap = [];   
}

Heap.prototype.empty = function(){
    return this.heap.length == 0;   
}

Heap.prototype.type = function(){
    return "Heap";   
}