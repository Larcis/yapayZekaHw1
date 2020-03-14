"use strict";

let start = null; //baslangıc koordinatı
let end = null; //bıtıs koordinatı
let state = 0; //durum makınesının durum degerı
let is_calculating = false; //arka planda suan hesaplama yapılıyor mu?

let c = new CanvasHelper(3000); //canvas
c.image_loader("images/test6.jpg"); //canvasa ilgili resmi yükle


let astar_worker = new Worker("js/astar.js"); //arka planda astar hesaplama altyapısı baslat
astar_worker.onmessage = worker_onmessage;

let best_first_search_worker = new Worker("js/bestfirstsearch.js");
best_first_search_worker.onmessage = worker_onmessage; //arka planda best first search hesaplama altyapısı baslat

setTimeout(function(){//500 ms sonra bu fonksiyonu calıstır. (resmin yuklemesını beklemek adına)

    c.set_onmousedown((e)=>{//canvasa mouse ıle tıklandıgında asagıdakı fonksıyonu calıstır.
        //e.preventDefault();
        console.log(e);
        if(e.button == 0){ // eger tıklanan mouse butonu sol tık ıse
            if(is_calculating || state > 1) return; //suan astar hesaplama yapıyorsa hıc bır sey yapmadan fonksıyondan cık
            switch (state) { //duruma baglı olarak
                case 0:
                    reload_wrapper();
                    start = [5*e.pageX, 5*e.pageY]; //ilk tıklamada baslangıc koordinatını set et
                break;
                case 1:
                    //ikinci tıklamada bitis noktasını set et ve
                    //astar koduna hesaplamayı baslatmak ıcın mesaj gonder
                    end = [5*e.pageX, 5*e.pageY]; 
                    trigger_workers();
                break;
            }
            ++state;
        } 
    });

}, 500);


function trigger_workers(){
    is_calculating = true;
    let im = c.get_img_data();
    let prev_state = state;
    function waitUntilStateChange(waited_state, func){
        if(state != waited_state ){
            setTimeout(()=>waitUntilStateChange(waited_state, func), 20);
        } else {
            func()
        }
    }
    console.log(im, start, end);
    astar_worker.postMessage({img: im, start:start, end: end, type: "heap"});
    waitUntilStateChange(3, ()=>{
        astar_worker.postMessage({img: im, start:start, end: end, type: "lsarray"});
        waitUntilStateChange(4, ()=>{
            best_first_search_worker.postMessage({img: im, start:start, end: end, type: "heap"});
            waitUntilStateChange(5, ()=> {
                best_first_search_worker.postMessage({img: im, start:start, end: end, type: "lsarray"});
            });
        });
    });
}

function reload_wrapper(){ //canvastakı resmı yenılemek ıcın
    is_calculating = true; //mousedown eventını ıptal etmek ıcın
    c.reload(); // aynı resmı bır daha yukle
    setTimeout(()=> is_calculating = false , 300); //300 ms sonra mousedown eventını tekrar aktıf et.
}

function worker_onmessage(e) { //arka planda calısan astar kodundan mesaj gelınce calıstırılacak fonksıyon
    if(e.data?.finished){ //eger gelen mesaj finished iceriyorsa
        let d = e.data;
        if(d.fail){ //gelen mesaj da fail true ise
            alert(d.message); // fail mesajını kullanıcıya goster
            reload_wrapper();
            state = 0;
            is_calculating = false; // hesaplama durumunu ayarla
        }else{ // eger fail etmemisse statları konsola yazdır.
            console.log(
                "stats "+d.type+":"+ 
                "\ntotal time: "+ d.time_taken+ 
                "\ntotal pop: "+d.total_pop+ 
                "\nmax stack size: "+d.max_stack_size+
                "\nstart: " + start +
                "\nfinish: " + end
            );
            if(state < 5)
                state ++;
            else{
                state = 0;
                is_calculating = false;
            }
        }
    } else if(e.data?.path){//eger astar kodundan gelen mesajda path varsa
        c.draw_path(e.data.path); // canvasa pathi cizdir.
    }
    else
        c.draw_dot({x:e.data[0], y:e.data[1]}); 
        //astar kodundan [x,y] koordinatı geldi. 
        //ilgili noktayı hesaplama esnasında ziyaret 
        //ettigini görsellestirmek icin canvasa yesil bir nokta ciz
}

/*
test_stack_and_lsarray(5555);
test_heap(5555);
test_lsarray(5555);
*/