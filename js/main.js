"use strict";

import {test_stack_and_lsarray, test_heap, test_lsarray} from './tests.js';
import {CanvasHelper} from './canvas_helper.js';
import {AStar} from './astar.js';


let c = new CanvasHelper(1000);

c.image_loader("images/test3.jpg");

setTimeout(function(){
    console.log(c.get_img_data());
    let img = c.get_img_data();
    var astar = new AStar(img);
    astar.set_end(0, 0);
    astar.set_start(600,300);
    astar.solve();
}, 50);

/*
test_stack_and_lsarray(5555);
test_heap(5555);
test_lsarray(5555);
*/
