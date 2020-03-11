"use strict";
import {AStar} from"./astar.js";
import {LsArray} from  "./stack.js";
import {Heap} from "./heap.js";


var canvas = document.createElement('canvas');
canvas.width = canvas.height = 1000;
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");

function clear_canvas(){
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

clear_canvas();


let base_image = new Image();
base_image.crossOrigin = "Anonymous";
base_image.src = 'images/test.jpg';

base_image.onload = function () {
	ctx.drawImage(base_image, 0, 0, canvas.width, canvas.height);
    var img = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

let stack = new LsArray();
let heap = new Heap();

for(let i = 10; i >0; i--){
    heap.insert(i);
    console.log(heap);
}
stack.pop();
