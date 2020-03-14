"use strict"; 

class CanvasHelper{
    constructor(size=1500, id="mc"){
        this.cur_img_path = null;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.canvas.height = size;
        this.canvas.id = id;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        this.img = null;
        this.loaded = false;
        this.loaded_image = new Image();
        this.loaded_image.crossOrigin = "Anonymous";
        let this_ = this;
        this.loaded_image.onload = function () {
            this_.loaded = true;
            this_.ctx.drawImage(this, 0, 0, this.width, this.height);
            this_.img = this_.ctx.getImageData(0, 0, this.width, this.height);
        }
        this.clear_canvas();
    }

}

CanvasHelper.prototype.clear_canvas = function(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

CanvasHelper.prototype.image_loader = function (path='images/test.jpg'){
    this.clear_canvas();
    this.loaded = false;
    this.cur_img_path = path;
    this.loaded_image.src = path;
}

CanvasHelper.prototype.reload = function (){
    this.clear_canvas();
    this.loaded = false;
    this.loaded_image.src = this.cur_img_path;
}


CanvasHelper.prototype.get_img_data = function (){ 
    return this.img;
}

CanvasHelper.prototype.draw_dot = function(cur, color="green", sz=1){
    this.ctx.fillStyle = color;
    this.ctx.fillRect(cur.x, cur.y, sz, sz);
}

CanvasHelper.prototype.set_onmousedown = function(func){
    this.canvas.onmousedown = func;
}


CanvasHelper.prototype.draw_path = function(path){
    path.forEach(i => {
        this.draw_dot(i, "blue", 3);
    });
}