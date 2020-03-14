"use strict";

let start = null;
let end = null;
let state = 0;
let is_calculating = false;

let c = new CanvasHelper(3000);
c.image_loader("images/test6.jpg");

function reload_wrapper(){
    is_calculating = true;
    c.reload();
    setTimeout(()=> is_calculating = false , 300);
}


let astar_worker = new Worker("js/astar.js");
astar_worker.onmessage = function(e) {
    if(e.data?.finished){
        let d = e.data;
        if(d.fail){
            alert(d.message);
            is_calculating = false;
        }else{
            console.log(
                "stats "+d.type+":"+ 
                "\ntotal time: "+ d.time_taken+ 
                "\ntotal pop: "+d.total_pop+ 
                "\nmax stack size: "+d.max_stack_size
            );
        }
        is_calculating = false;
    } else if(e.data?.path){
        c.draw_path(e.data.path);
    }
    else
        c.draw_dot({x:e.data[0], y:e.data[1]});
}
setTimeout(function(){
    c.set_onmousedown((e)=>{
        //e.preventDefault();
        console.log(e);
        if(e.button == 0){
            if(is_calculating) return;
            switch (state) {
                case 0:
                    //reload_wrapper();
                    start = [5*e.pageX, 5*e.pageY];
                break;
                case 1:
                    end = [5*e.pageX, 5*e.pageY];
                    is_calculating = true;
                    let im = c.get_img_data();
                    console.log(im, start, end);
                    astar_worker.postMessage({img: im, start:start, end: end, type: "heap"}); 
                break;
            }
            state = ++state % 2;
        } 
    });
}, 500);


/*
test_stack_and_lsarray(5555);
test_heap(5555);
test_lsarray(5555);
*/