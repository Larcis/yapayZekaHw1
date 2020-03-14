"use strict";

importScripts('heap.js', 'lsarray.js');

class AStar{
    constructor(mode="heap"){
        this.w  = null;
        this.h = null;
        this.data = null;
        if(mode == "heap")
            this.open_nodes = new Heap();
        else
            this.open_nodes = new LsArray();
        this.start = null;
        this.end = null;
        this.visited = {};
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
        return Math.sqrt((i - this.end.x) ** 2 + (j - this.end.y) ** 2)*10;
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
            let gcost = this.gn(xx, yy) + parent.g_cost;
            let item = {x: xx, y: yy, cost:(this.hn(xx, yy) + gcost), g_cost: gcost};
            if(this.is_in_range(xx, yy) && !this.visited[""+xx+yy]){
                this.visited[""+xx+yy] = parent;
                this.open_nodes.insert(item);
            }

        }
    }
    clear_state(){
        this.start = this.end = null;
        this.visited = {};
        this.open_nodes.clear();
    }
    set_start(i, j){
        if(i  <= this.w && j < this.h)
            this.start = {x: i, y: j, cost: this.hn(i, j), g_cost: 0};
    }
    set_end(i, j){
        if(i  <= this.w && j < this.h)
            this.end = {x: i, y: j};
    }
    trace_back(){
        let path = [];
        let cur = this.end;
        do{
            path.push(cur);
            cur = this.visited[""+cur.x+cur.y];
        }while(!this.is_start(cur));
        postMessage({path: path});
        this.clear_state();
    }
    is_end(cur){
        return (cur.x == this.end.x && cur.y == this.end.y);
    }
    is_start(cur){
        return (cur.x == this.start.x && cur.y == this.start.y);
    }
    solve(){
        if(this.start == null || this.end == null){
            console.log("başlangıç veya bitiş noktası belli değil.");
            this.clear_state();
            postMessage({finished: true});
            return;
        }
        this.open_nodes.clear();
        this.open_nodes.insert(this.start);
        let found = false;
        let cur = null;
        let iter = 599999;
        while(!this.open_nodes.empty() && !found){
            cur = this.open_nodes.pop_min();
            //postMessage(cur);
            if(this.is_end(cur)){
                found = true;
            } else {
                this.add_neighbours(cur);
            }
        }
        postMessage({finished: true});
        this.trace_back();
    }
}

var astar = new AStar("lsarray");
onmessage = function(e){
    astar.set_image(e.data.img);
    astar.set_end(e.data.end[0],e.data.end[1]);
    astar.set_start(e.data.start[0], e.data.start[1]);
    astar.solve();
}
