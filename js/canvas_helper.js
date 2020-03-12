"use strict"; 
export {CanvasHelper};


class CanvasHelper{
    constructor(size=1500, id="mc"){
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
    this.ctx.fillStyle = "gray";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
}

CanvasHelper.prototype.image_loader = function (path='images/test.jpg'){
    this.clear_canvas();
    this.loaded = false;
    this.loaded_image.src = path;
}


CanvasHelper.prototype.get_img_data = function (){ 
    return this.img;
}