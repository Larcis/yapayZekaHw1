"use strict";
/**
 * heap ve lsarray e test_size tane ters sıralı(büyükten küçüğe) eleman ekleyi
 * test_size/2 tanesini pop layan test case.
 */
function test_stack_and_lsarray(test_size=5999){
    let stack = new LsArray();
    let heap = new Heap();
    console.log("starting lsarray vs heap benchmark for ", test_size, " items");
    console.time("heap");
    for(let i = test_size; i >0; i--){
        heap.insert({cost: i});
    }
    for(let i = 0; i <test_size/2; i++){
        heap.pop_min();
    }
    console.timeEnd("heap");
    
    
    console.time("lsarray");
    for(let i = test_size; i >  0; i--){
        stack.insert({cost: i});
    }
    for(let i = 0; i <test_size/2; i++){
        stack.pop_min();
    }
    console.timeEnd("lsarray");

};

/**
 * heap e l tane ters sıralı eleman ekleyıp
 * bunları sırayla cekerek heapin doğruluğunu
 * kontrol eden test case
 */
function test_heap(l=100){
    let heap = new Heap();
    console.time("heapSoloTest");
    for(let i = l; i > 0; i--)
        heap.insert({cost: i});
    let fail = false;
    for(let i = 1; i <= l; i++){
        if(heap.pop_min().cost != i){
            console.log("heap is broken");
            fail = true;
            break;
        }
    }
    if(!fail)
        console.log("heap is working fine for ",l," reverse ordered number.")
    console.timeEnd("heapSoloTest");
}

/**
 * yukarıdakinin lsarray(linear search array) versiyonu 
 */
function test_lsarray(l=100){
    let heap = new LsArray();
    console.time("lsarraySoloTest");
    for(let i = l; i > 0; i--)
        heap.insert({cost: i});
    let fail = false;
    for(let i = 1; i <= l-1; i++){
        if(heap.pop_min().cost != i){
            console.log("lsarray is broken");
            fail = true;
            break;
        }
    }
    if(!fail)
        console.log("lsarray is working fine for ",l," reverse ordered number.")
    console.timeEnd("lsarraySoloTest");
}

