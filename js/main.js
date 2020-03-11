"use strict";

import {test_stack_and_lsarray, test_heap} from './tests.js';

var canvas = document.createElement('canvas');
canvas.width = canvas.height = 1000;
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");

function clear_canvas(){
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

clear_canvas();

function image_loader(path='images/test.jpg'){
    let base_image = new Image();
    base_image.crossOrigin = "Anonymous";
    base_image.src = 'images/test.jpg';
    
    base_image.onload = function () {
        ctx.drawImage(base_image, 0, 0, canvas.width, canvas.height);
        var img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
}

image_loader();

test_stack_and_lsarray(5555);
test_heap(98765);