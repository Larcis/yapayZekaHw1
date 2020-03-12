"use strict";
import {Heap} from "./heap.js";
import {LsArray} from './lsarray.js';
export {AStar};

class AStar{
    constructor(mode="heap", canvas_helper){
        let image = canvas_helper.get_img_data();
        this.w  = image.width;
        this.h = image.height;
        this.data = image.data;
        if(mode == "heap")
            this.open_nodes = new Heap();
        else
            this.open_nodes = new LsArray();
        this.start = null;
        this.end = null;
        this.canvas_helper = canvas_helper;
        this.state = 0;
        this.canvas_helper.set_onmousedown((e)=>{
            console.log(this.state);
            switch (this.state) {
                case 0:
                    this.set_start(e.pageX, e.pageY);
                break;
                case 1:
                    this.set_end(e.pageX, e.pageY);
                //break;
                case 2:
                    setTimeout(()=>this.solve(), 50);
                    this.canvas_helper.reload();
                    console.log(this.start, this.end);
                break;
            }
            this.state = ++this.state % 2;
        });
    }
    gn(i, j){
        let idx = 4 * (i * this.w + j);
        let r = this.data[idx];
        //alert(r)
        if(r == 0) r = 1;
        //console.log(r);
        return r;
    }
    hn(i, j){
        return Math.sqrt((i - this.end.x) ** 2 + (j - this.end.y) ** 2)*255;
        //return (Math.abs(i - this.end.x) + Math.abs(j - this.end.y))*255;
    }
    is_in_range(i, j){
        if(i < 0 || i >= this.w || j < 0 || j >= this.h)
            return false;
        return true;
    }
    add_neighbours(i, j, parent_gcost){
        let x_ = [1, -1, 0, 0];
        let y_ = [0, 0 , 1, -1];
        for(let it = 0; it < 4; it++){
            let xx = i + x_[it];
            let yy = j + y_[it];
            let gcost = this.gn(xx, yy) + parent_gcost;
            let item = {x: xx, y: yy, cost:(this.hn(xx, yy) + gcost), g_cost: gcost,  parent: [i, j]};
            if(this.is_in_range(xx, yy)){
                this.open_nodes.insert(item);
            }

        }
    }
    set_start(i, j){
        this.start = {x: i, y: j, cost: 0, g_cost: 0};
    }
    set_end(i, j){
        this.end = {x: i, y: j};
    }
    trace_back(){

    }
    is_end(cur){
        return (cur.x == this.end.x && cur.y == this.end.y);
    }
    solve(){
        if(this.start == null || this.end == null){
            alert("başlangıç veya bitiş noktası belli değil.");
            return;
        }
        this.open_nodes.clear();
        this.open_nodes.insert(this.start);
        let found = false;
        let cur = null;
        let iter = 999999;
        while(!this.open_nodes.empty() && !found && --iter){
            cur = this.open_nodes.pop_min();
            this.canvas_helper.draw_dot(cur);
            if(this.is_end(cur)){
                found = true;
            } else {
                this.add_neighbours(cur.x, cur.y, cur.g_cost);
            }
        }
        console.log("iter end: "+cur.x+ " "+ cur.y + " " + cur.cost + " ");

    }
}