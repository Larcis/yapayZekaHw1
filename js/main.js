"use strict";

let start = null;
let end = null;
let state = 0;
let is_calculating = false;

let c = new CanvasHelper(2000);

c.image_loader("images/test3.jpg");

let worker = new Worker("js/astar.js");
worker.onmessage = function(e) {
    if(e.data?.finished){
        //c.clear_canvas();
        //c.image_loader("images/test5.jpg");
        is_calculating = false;
    } else if(e.data?.path){
        c.draw_path(e.data.path);
    }
    else
        c.draw_dot(e.data);
}
setTimeout(function(){
    c.set_onmousedown((e)=>{
        if(is_calculating) return;
        switch (state) {
            case 0:
                start = [e.pageX, e.pageY];
            break;
            case 1:
                end = [e.pageX, e.pageY];
            //break;
            case 2:
                is_calculating = true;
                worker.postMessage({img: c.get_img_data(), start:start, end: end}); 
            break;
        }
        state = ++state % 2;
    });
}, 500);


/*
test_stack_and_lsarray(5555);
test_heap(5555);
test_lsarray(5555);
*/
