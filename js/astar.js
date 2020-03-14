"use strict";

importScripts('heap.js', 'lsarray.js');

class AStar{
    constructor(mode="heap", hn_coefficient=127){
        this.w  = null;
        this.h = null;
        this.data = null;
        this.hn_coefficient = hn_coefficient;
        if(mode == "heap")
            this.open_nodes = new Heap();
        else
            this.open_nodes = new LsArray();
        this.start = null;
        this.end = null;
        this.visited = {};
        this.max_stack_size = 0;
    }
    set_image(image){
        this.w  = image.width;
        this.h = image.height;
        this.data = image.data;
    }
    gn(i, j){
        let idx = 4 * (j * this.w + i);
        let r = 255 - this.data[idx];
        if(r == 0) r = 1;
        return r;
    }
    hn(i, j){
        if(this.end)
            return Math.sqrt((i - this.end.x) ** 2 + (j - this.end.y) ** 2)*this.hn_coefficient;
        return Number.MAX_VALUE;
        //return (Math.abs(i - this.end.x) + Math.abs(j - this.end.y))*2;
    }
    is_in_range(i, j){
        if(i < 0 || i >= this.w || j < 0 || j >= this.h)
            return false;
        return true;
    }
    add_neighbours(parent){
        let x_ = [1, -1, 0, 0];
        let y_ = [0, 0 , 1, -1];
        for(let it = 0; it < 4; it++){
            let xx = parent.x + x_[it];
            let yy = parent.y + y_[it];
            if(this.is_in_range(xx, yy) && !this.visited[xx+"_"+yy]){
                let gcost = this.gn(xx, yy) + parent.g_cost;
                let item = {x: xx, y: yy, cost:(this.hn(xx, yy) + gcost), g_cost: gcost};
                this.visited[xx+"_"+yy] = parent;
                //postMessage([xx, yy]);
                this.open_nodes.insert(item);
            }
        }
        let sz = this.open_nodes.size();
        if(sz > this.max_stack_size){
            this.max_stack_size = sz;
        }
    }
    clear_state(){
        this.start = this.end = null;
        this.visited = {};
        this.open_nodes.clear();
        this.max_stack_size = 0;
    }
    set_start(i, j){
        if(i  <= this.w && j <= this.h)
            this.start = {x: i, y: j, cost: this.hn(i, j), g_cost: 0};
    }
    set_end(i, j){
        if(i  <= this.w && j <= this.h)
            this.end = {x: i, y: j};
    }
    trace_back(){
        let path = [];
        let cur = this.end;
        do{
            path.push(cur);
            cur = this.visited[cur.x+"_"+cur.y];
        }while(!this.is_start(cur));
        path.push(this.start);
        postMessage({path: path});
    }
    is_end(cur){
        return (cur.x == this.end.x && cur.y == this.end.y);
    }
    is_start(cur){
        return (cur.x == this.start.x && cur.y == this.start.y);
    }
    solve(){
        if(this.start == null || this.end == null){
            this.clear_state();
            postMessage({
                finished: true, 
                fail: true,
                message: "başlangıç veya bitiş noktası belli değil."
            });
            return;
        }
        console.log("başlangıç: " , this.start);
        console.log("bitiş: " , this.end);    
        this.open_nodes.clear();
        this.open_nodes.insert(this.start);
        let found = false;
        let cur = null;
        let t0 = performance.now();
        let count = 0;
        while(!this.open_nodes.empty() && !found){
            cur = this.open_nodes.pop_min();
            count++;
            if(this.is_end(cur)){
                found = true;
            } else {
                this.add_neighbours(cur);
            }
        }
        if(found){
            this.trace_back();
            postMessage({
                finished: true, 
                fail: false, 
                time_taken: performance.now() - t0, 
                total_pop: count, 
                max_stack_size: this.max_stack_size,
                type: this.open_nodes.type()
            });
            this.clear_state();
        } else {
            postMessage({
                finished: true, 
                fail: true, 
                message: "yol bulunamadı."
            });
        } 
    }
}

let hn_coeff = 1;
var astar_h = new AStar("heap", hn_coeff);
var astar_ls = new AStar("lsarray", hn_coeff);
onmessage = function(e){
    if(e.data?.type == "heap"){
        trigger_astar(astar_h, e);
    } else {
        trigger_astar(astar_ls, e);
    }
}

function trigger_astar(astar, e){
    astar.set_image(e.data.img);
    astar.set_end(e.data.end[0],e.data.end[1]);
    astar.set_start(e.data.start[0], e.data.start[1]);
    astar.solve();
}
