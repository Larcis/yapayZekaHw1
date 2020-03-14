"use strict";

/**
 * min heap implemantasyonu
 */
class Heap{
    constructor(){
        this.heap = [];
    }
};

/**
 * heape eleman ekle
 */
Heap.prototype.insert = function(obj){
    this.heap.push(obj);
    this.up_heapify();
}

/**
 * heap ten eleman çek
 */
Heap.prototype.pop_min = function(){
    if(this.heap.length > 0){
        this.swap(0, this.heap.length-1); //bastakı elamanı sondakıyle yer degıstır. mınımum artık sondakı eleman
        let min = this.heap.pop(); // sondakı eleman ı popla
        this.down_heapify(0);  //agacı duzelt
        return min;
    }
}

/**
 * agactan mınımum degerı cıkarmak yerıne o ankı mınımum degere
 * bakmak ıcın yazılmıs method.
 */
Heap.prototype.look_min = function(){
    if(this.heap.length > 0)
        return this.heap[0];
}

/**
 * heap e yeni bir eleman eklendiginde en sona eklenir.
 * ama bu elemanın gercek yerı en son olmayabılır.
 * bu elemanın gercek yerı parentından buyuk oldugu yerdır. 
 * sona eklenen bu yenı elemanın yerını bulabılmek ıcın 
 * sondan baslayarak parent ından kucuk oldugu surece ve 
 * agacın tepesıne ulasmadıgı surece parentı ıle yer degıstırıp
 * yenı yerlestıgı yerden, sartlardan bırını saglayana kadar
 * aynı ısleme devam eder.
 */
Heap.prototype.up_heapify = function(){
    let idx = this.heap.length - 1;
    while(idx != 0 && this.is_greater(this.parent(idx), idx)){
        this.swap(this.parent(idx), idx);
        idx = this.parent(idx);
    }
}

/**
 * verilen iki indisteki degerleri birbiriyle kıyaslar
 */
Heap.prototype.is_greater = function(i, j){
    return this.heap[i].cost > this.heap[j].cost;
}

Heap.prototype.down_heapify = function(idx){
    let l = this.left_child(idx);
    let r = this.right_child(idx);
    let min = idx;
    if (l < this.heap.length && this.is_greater(idx, l)) //suanki eleman left childından büyük mü?
        min = l; 
    if (r < this.heap.length && this.is_greater(min, r)) //suanki eleman veya left childından minimum olan  right childdan büyük mü?
        min = r; 
    if (min != idx) {  
        //minimum left veya right child oldugu surece minimum ve idx in
        //yerini degistir ve minimum un oldugu yerden aynı ıslemı tekrarla
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

Heap.prototype.size = function(){
    return this.heap.length;   
}