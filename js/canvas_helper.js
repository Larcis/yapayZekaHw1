"use strict"; 

class CanvasHelper{
    constructor(size=1500, id="mc"){
        this.cur_img_path = null; //canvasta o anda buluna resmin path i
        this.path_colors = null; //secilebilecek path(yol) renkleri
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.canvas.height = size;
        this.canvas.id = id;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        this.img = null; //canvasta buluna resmin w, h ve data si
        this.loaded = false; //canvasa resmin yüklenip yüklenmediğini takip eden değişken
        this.loaded_image = new Image();
        this.loaded_image.crossOrigin = "Anonymous";
        this.last_path_state = 0;
        let this_ = this;
        this.loaded_image.onload = function () {
            this_.loaded = true;
            this_.ctx.drawImage(this, 0, 0, this.width, this.height);
            this_.img = this_.ctx.getImageData(0, 0, this.width, this.height);
        }
        this.clear_canvas();
        this.set_path_colors();
    }

}

CanvasHelper.prototype.set_path_colors = function(){
    this.path_colors = ["green", "yellow", "blue", "white", "lime", "violet"];
}

/**
 * yukarıda tanımlı 6 renkten 1 ni rastgele secer ve sectigi 
 * rengi geri döndürür. Secilen renk listeden silinir bu sayede
 * aynı renk ta ki tüm diger renkler bir kere secilene kadar bir
 * daha secilmez. renk listesi bosaldıgında tekrardan tum renkler
 * ile yeniden doldurulur.
 */
CanvasHelper.prototype.get_path_color = function(){
    if(this.path_colors.length == 0)
        this.set_path_colors();
    let idx = Math.floor(Math.random() * this.path_colors.length);
    let color = this.path_colors[idx];
    this.path_colors.splice(idx, 1); 
    return color;
}

/**
 * canvası tamamen temizler.
 */
CanvasHelper.prototype.clear_canvas = function(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

/**
 * canvas a path i verilen resmi yükler.
 */
CanvasHelper.prototype.image_loader = function (path='images/test.jpg'){
    this.clear_canvas();
    this.loaded = false;
    this.cur_img_path = path;
    this.loaded_image.src = path;
}

/**
 * canvas ta o anda buluna resmi canvasa bir daha yükler.
 * amacı canvas ta resim üzerine yapılan cizimleri silmektir.
 */
CanvasHelper.prototype.reload = function (){
    this.clear_canvas();
    this.loaded = false;
    this.loaded_image.src = this.cur_img_path;
}

/**
 * bu sınıf aracılıgıyla, o sırada canvasta cızılı resmın
 * width, height ve tek boyutlu dizi olarak rgba değerleri 
 * saklanan resim verisini geri döndürür
 */
CanvasHelper.prototype.get_img_data = function (){ 
    return this.img;
}

/**
 * canvas ta cur.x, cur.y konumunda sz*sz buyuklugunde color renginde bir kare cizer.
 */
CanvasHelper.prototype.draw_dot = function(cur, color="green", sz=1){
    this.ctx.fillStyle = color;
    this.ctx.fillRect(cur.x, cur.y, sz, sz);
}

/**
 * canvas ın mousedown eventini bu class aracılıgıyla baglamaya yarayan method.
 */
CanvasHelper.prototype.set_onmousedown = function(func){
    this.canvas.onmousedown = func;
}

/**
 * kendisine verilen path dizisini canvasa cizer.
 * her cizdirme isleminde tanımlı 6 renkten birini rastgele secip path i o renk ile cizdirir.
 * last_path_state parametresi, draw_path in her ikinci çağrılışında pathi x ve y de 5 birim öteler
 * bunun amacı üst üste gelecek pathleri daha rahat görebilmektir.
 */
CanvasHelper.prototype.draw_path = function(path){
    let color = this.get_path_color();
    for(let i = this.last_path_state; i < path.length; i+=8){
        path[i].x += this.last_path_state;
        path[i].y += this.last_path_state;
        this.draw_dot(path[i], color, 6);
    }
    this.last_path_state = !this.last_path_state ? 5 : 0;
    /*path.forEach(i => {
        this.draw_dot(i, "blue", 3);
    });*/
}