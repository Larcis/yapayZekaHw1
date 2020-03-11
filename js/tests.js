"use strict";

import {LsArray} from './lsarray.js';
import {Heap} from './heap.js';

export {test_stack_and_lsarray, test_heap};

function test_stack_and_lsarray(test_size=5999){
    let stack = new LsArray();
    let heap = new Heap();
    console.log("starting lsarray vs heap benchmark for ", test_size, " items");
    console.time("heap");
    for(let i = test_size; i >0; i--){
        heap.insert(i);
    }
    for(let i = 0; i <test_size/2; i++){
        heap.pop_min();
    }
    console.timeEnd("heap");
    
    
    console.time("lsarray");
    for(let i = test_size; i >0; i--){
        stack.push(i);
    }
    for(let i = 0; i <test_size/2; i++){
        stack.pop_min();
    }
    console.timeEnd("lsarray");

};

function test_heap(l=100){
    let heap = new Heap();
    for(let i = l; i > 0; i--)
        heap.insert(i);
    let fail = false;
    for(let i = 1; i <= l; i++){
        if(heap.pop_min() != i){
            console.log("heap is broken");
            fail = true;
            break;
        }
    }
    if(!fail)
        console.log("heap is working fine for ",l," reverse ordered number.")
}

