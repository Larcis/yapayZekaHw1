"use strict";

importScripts('heap.js', 'lsarray.js');

class AStar{
    constructor(mode="heap", hn_coefficient=127){
        this.w  = null; // üzerinde çalışılacak resmmin genişliği
        this.h = null; //üzerinde çalışılacak resmmin yüksekliği
        this.data = null; // üzerinde çalışılacak resmmin verisi
        this.hn_coefficient = hn_coefficient; //heuristic function ın sonucunun çarpıldığı sayı
        if(mode == "heap")
            this.open_nodes = new Heap(); //astar yaparken o an secilebilecek nodların saklandıgı alan
        else
            this.open_nodes = new LsArray();
        this.start = null; //astar baslangıc koordinatı
        this.end = null; // bitis koordinatı
        this.visited = {}; //astar yaparken daha önce ziyaret edilmiş nodların parentlarının saklandıgı alan
        this.max_stack_size = 0; //stackin en buyuk oldugu andakı degerı
    }
    /**
     * astar da kullanılacak resmı set eder
     */
    set_image(image){
        this.w  = image.width;
        this.h = image.height;
        this.data = image.data;
    }
    /**
     * bir hucreye yapılacak harekedın maliyeti
     * hucrenın R degerının tersıdır(255-R)
     * maliyet 0 sa 1 e cevirilir
     */
    gn(i, j){
        let idx = 4 * (j * this.w + i);
        let r = 255 - this.data[idx];
        if(r == 0) r = 1;
        return r;
    }
    /**
     * heuristic cost fonksiyonu
     * euclid distance kullanılıyor.
     */
    hn(i, j){
        if(this.end)
            return Math.sqrt((i - this.end.x) ** 2 + (j - this.end.y) ** 2)*this.hn_coefficient;
        return Number.MAX_VALUE;
        //return (Math.abs(i - this.end.x) + Math.abs(j - this.end.y))*2;
    }
    /**
     * verilen koordinatın resmin sınırları içerisinde
     * olup olmadıgını kontrol eder.
     */
    is_in_range(i, j){
        if(i < 0 || i >= this.w || j < 0 || j >= this.h)
            return false;
        return true;
    }
    /**
     * verilen bir nodun uygun komsularını
     * open_nodes(o an gıdılebılecek nodlar) listesine
     * ekler.
     */
    add_neighbours(parent){
        let x_ = [1, -1, 0, 0];
        let y_ = [0, 0 , 1, -1];
        for(let it = 0; it < 4; it++){
            let xx = parent.x + x_[it];
            let yy = parent.y + y_[it];
            if(this.is_in_range(xx, yy) && !this.visited[xx+"_"+yy]){ //eger komsu resmin sınırlarındaysa ve daha once zıyaret edılmedıyse
                let gcost = this.gn(xx, yy) + parent.g_cost; //ilgili komsuya gitmenin gercek maliyeti
                let item = {x: xx, y: yy, cost:(this.hn(xx, yy) + gcost), g_cost: gcost};
                this.visited[xx+"_"+yy] = parent; //ilgili komsuyu ziyaret edildi olarak işaretle
                //postMessage([xx, yy]); 
                //üstteki satır main threade mesaj gonderır ve 
                //main thread ilgili x, y yi hesaplama yapılırken ziyaret edildi diye yesile boyar
                //ilgili satırı comment ten cıkarırsanız astar yapılırken bakılan tum hucrelerı gorsel olarak gorebılırsınız
                //debug amaclı kullanıldı.
                this.open_nodes.insert(item); //ilgili komsuyu gidilebilecek nodllar listesine ekle
            }
        }
        let sz = this.open_nodes.size(); //open_nodes un o anki uzunlugu max_stack_size dan buyukse max_stack_size ı degıstır.
        if(sz > this.max_stack_size){
            this.max_stack_size = sz;
        }
    }
    /**
     * yeni hesaplama oncesı kullanılacak degiskenleri sıfırla.
     */
    clear_state(){
        this.start = this.end = null;
        this.visited = {};
        this.open_nodes.clear();
        this.max_stack_size = 0;
    }
    /**
     * hesaplamada kullanılacak baslangıc noktasını set et
     */
    set_start(i, j){
        if(this.is_in_range(i, j))
            this.start = {x: i, y: j, cost: this.hn(i, j), g_cost: 0};
    }
    /**
     * hesaplamada kullanılacak bitis noktasını set et
     */
    set_end(i, j){
        if(this.is_in_range(i, j))
            this.end = {x: i, y: j};
    }
    /**
     * bitis noktasından ziyaret edilenler listesindeki parent bilgisini kullanarak
     * pathi olustur ve main thread e pathi mesaj gonder.
     */
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
    /**
     * verilen nod , bitis noktası mı diye kontrol eder
     */
    is_end(cur){
        return (cur.x == this.end.x && cur.y == this.end.y);
    }
    /**
     * verilen nod, baslangıc noktası mı diye kontrol eder.
     */
    is_start(cur){
        return (cur.x == this.start.x && cur.y == this.start.y);
    }
    /**
     * set edilmis baslangıc ve bitis noktası arasında astar yapar
     * heurisitic fonksiyon olarak sınıf icerisinde tanımlı hn fonksiyonunu
     * kullanır. Gercek maliyet hesabı için sınıf içerisinde tanımlı 
     * gn fonksiyonunu kullanır. eger baslangıc veya bitis set edilmemisse
     * hesaplama yapılmaz ve main thread e durum hakkında bilgi mesajı 
     * gonderilir.
     */
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
        this.open_nodes.insert(this.start); //baslangıc noktasını gıdılebılecekler lıstesıne ekle
        let found = false; //sona ulastı mı dıye kontrol degerı
        let cur = null; //ilgili iterasyonda kullanılacak nod
        let t0 = performance.now(); //baslangıc zamanını kaydet
        let count = 0; // kac eleman cektıgımı sayacagım
        while(!this.open_nodes.empty() && !found){ // gidilebilecekler listesi bos degilken ve sona ulasmamısken
            cur = this.open_nodes.pop_min(); //gidilebilecekler listesinden minimum costa sahip nodu al
            count++; //listeden cektıgım eleman sayısını 1 arttır
            if(this.is_end(cur)){ // eger bu iterasyondaki nod bitis noktasıysa sona ulastım degerını set et ve dongu bıtecek
                found = true;
            } else {
                this.add_neighbours(cur); 
                //eger bu iterasyonda sona ulasmadıysam ,
                // bu iterasyondaki nodun komsularından uygun olanları
                //gidilebilecekler listesine ekle
            }
        }
        if(found){ // eger sona ulastıysam
            this.trace_back(); //pathi uret
            postMessage({ // main threade calısma zamanınla ilgili vs. mesaj gonder.
                finished: true, 
                fail: false, 
                time_taken: performance.now() - t0, 
                total_pop: count, 
                max_stack_size: this.max_stack_size,
                type: this.open_nodes.type()
            });
        } else {
            postMessage({ //eger sona ulasmadıysam main threade haber ver.
                finished: true, 
                fail: true, 
                message: "yol bulunamadı."
            });
        }
        this.clear_state();
    }
}

let hn_coeff = 1; // heuristic fonksiyonunda cıkan degerın carpılacagı sayı
var astar_h = new AStar("heap", hn_coeff); //heap yapısını kullanan astar
var astar_ls = new AStar("lsarray", hn_coeff); //linear search ile minimum bulan normal bir diziyi kullanan astar

onmessage = function(e){//main thread den mesaj gelirse calısacak fonksiyon
    if(e.data?.type == "heap"){ //heap yapısıyla ıstıyorsa heapli astar ı calıstır.
        trigger_astar(astar_h, e);
    } else {
        trigger_astar(astar_ls, e);
    }
}

/**
 * astar objesının kullanacagı resmı, baslangıc ve bıtıs noktasını set et ve
 * sonrasında cozmeye basla.
 */
function trigger_astar(astar, e){ 
    astar.set_image(e.data.img);
    astar.set_end(e.data.end[0],e.data.end[1]);
    astar.set_start(e.data.start[0], e.data.start[1]);
    astar.solve();
}
