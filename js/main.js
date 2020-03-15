"use strict";


//arayuz ıcın kullanılan degıskenler.
let messages = [
    "Başlangıç noktası için mouse ile resmin üzerinde herhangi bir yere tıklayınız.",
    "Bitiş noktası için mouse ile resmin üzerinde herhangi bir yere tıklayınız.",
    "Heap ile çalışan A* kodunun bitmesi bekleniyor...",
    "Stack ile çalışan A* kodunun bitmesi bekleniyor...",
    "Heap ile çalışan Best First Search kodunun bitmesi bekleniyor...",
    "Stack ile çalışan Best First Search kodunun bitmesi bekleniyor...",
];
let message_colors = [
    "black",
    "black",
    "green", 
    "yellow", 
    "blue", 
    "Indigo"
];

let ui_element = document.getElementById("uiElement"); // ui için kullanılan div html elementi
let input_button = document.getElementById("img_input"); //input butonu
let rng_slider = document.getElementById("rng"); //hn_coeff ayarlayıcı
let rng_display = document.getElementById("hnCoeffText");//hn_coeff in o anki değerini gösteren html elementi
let start = null; //baslangıc koordinatı
let end = null; //bıtıs koordinatı
let state = 0; //durum makınesının durum degerı
update_ui();
let is_calculating = false; //arka planda suan hesaplama yapılıyor mu?

let c = new CanvasHelper(3000); //canvas
c.image_loader("images/test7.jpg"); //canvasa ilgili resmi yükle


let astar_worker = new Worker("js/astar.js"); //arka planda astar hesaplama altyapısı baslat
astar_worker.onmessage = worker_onmessage;

let best_first_search_worker = new Worker("js/bestfirstsearch.js");
best_first_search_worker.onmessage = worker_onmessage; //arka planda best first search hesaplama altyapısı baslat


setTimeout(function(){//500 ms sonra bu fonksiyonu calıstır. (resmin yuklemesını beklemek adına)

    c.set_onmousedown((e)=>{//canvasa mouse ıle tıklandıgında asagıdakı fonksıyonu calıstır.
        //e.preventDefault();
        let coeff = (c.canvas.width / c.canvas.offsetWidth);
        let coord = [Math.floor(coeff*e.pageX), Math.floor(coeff*e.pageY)];
        if(e.button == 0 ){ // eger tıklanan mouse butonu sol tık ıse
            if(is_calculating || state > 1) return; //suan astar hesaplama yapıyorsa hıc bır sey yapmadan fonksıyondan cık
            switch (state) { //duruma baglı olarak
                case 0:
                    clear_ui();
                    reload_wrapper();
                    start = coord; //ilk tıklamada baslangıc koordinatını set et
                break;
                case 1:
                    end = coord; //ikinci tıklamada bitis noktasını set et ve
                    trigger_workers(); // worker ları tetikle
                break;
            }
            ++state;
            update_ui();
        } 
    });

}, 500);


function set_hn_coeff_main(val){
    //console.log(val)
    rng_display.innerText = "hn_coeff: "+val;
    astar_worker.postMessage({hn_coeff: val});
}

function update_ui(){
    var p = document.createElement("p");
    var node = document.createTextNode("• "+messages[state]);
    p.style.fontSize = "16px";
    p.style.color = message_colors[state];
    p.appendChild(node);
    ui_element.appendChild(p);
}

function clear_ui(){
    ui_element.innerHTML = "Şu anki durum: ";
    update_ui();
}

/**
 * sırasıyla heap ile astar, lsarray ile astar
 * heap ile bfs ve lsarray ile bfs çalıştırır
 * (arkada çalışan threadlere mesaj göndererek).
 * sırada bir sonraki bir öncekinin bitimiyle tetiklenir.
 */
function trigger_workers(){
    set_is_calculating(true);
    let im = c.get_img_data();
    function waitUntilStateChange(waited_state, func){
        if(state != waited_state ){
            setTimeout(()=>waitUntilStateChange(waited_state, func), 10);
        } else {
            func()
        }
    }
    //console.log(im, start, end);
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
    set_is_calculating(true); //mousedown eventını ıptal etmek ıcın
    c.reload(); // aynı resmı bır daha yukle
    setTimeout(()=> {
        set_is_calculating(false); 
    }, 300); //300 ms sonra mousedown eventını tekrar aktıf et.
}
//setInterval(()=> console.log(state), 50);
function worker_onmessage(e) { //arka planda calısan astar kodundan mesaj gelınce calıstırılacak fonksıyon
    if(e.data.hasOwnProperty("finished")){ //eger gelen mesaj finished iceriyorsa
        let d = e.data;
        if(d.fail){ //gelen mesaj da fail true ise
            alert(d.message); // fail mesajını kullanıcıya goster
            reload_wrapper();
            state = 0;
            //setTimeout(()=>clear_ui(), 3500);
            set_is_calculating(false); // hesaplama durumunu ayarla
        }else{ // eger fail etmemisse statları konsola yazdır.
            console.log(
                "stats "+d.type+":"+ 
                "\ntotal time: "+ d.time_taken+ 
                "\ntotal pop: "+d.total_pop+ 
                "\nmax stack size: "+d.max_stack_size+
                "\nstart: " + start +
                "\nfinish: " + end
            );
            let arr = [
                `${Math.round(d.time_taken*100)/100} ms (${Math.round(d.time_taken /1000)} sn)`, 
                d.total_pop, 
                d.max_stack_size, 
                `x: ${start[0]}, y: ${start[1]}`, 
                `x: ${end[0]}, y: ${end[1]}`];
            create_table(arr);
            if(state < 5){
                state++;
                update_ui();
            } else {
                state = 0;
                //setTimeout(()=>clear_ui(), 3500);
                set_is_calculating(false);
            }
        }
    } else if(e.data.hasOwnProperty("path")){//eger astar veya bfs kodundan gelen mesajda path varsa
        c.draw_path(e.data.path); // canvasa pathi cizdir.
    }
    else
        c.draw_dot({x:e.data[0], y:e.data[1]}); 
        //astar veya bfs kodundan [x,y] koordinatı geldi. 
        //ilgili noktayı hesaplama esnasında ziyaret 
        //ettigini görsellestirmek icin canvasa yesil bir nokta ciz
}

function create_table(data) {
    var tbl = document.createElement('table');
    tbl.style.width = '100%';
    tbl.setAttribute('border', '1');
    var tbdy = document.createElement('tbody');
    let row_defines = [
        "Çalışma Süresi: ", 
        "Toplam Çekilen Eleman: ", 
        "Maksimum Stack Uzunluğu: ", 
        "Başlangıç Noktası: ", 
        "Bitiş Noktası: "
    ];
    for (var i = 0; i < 5; i++) {
        var tr = document.createElement('tr');
        tr.style.fontSize = "14px";

        var td = document.createElement('td');
        td.appendChild(document.createTextNode(row_defines[i]))
        tr.appendChild(td)
        
        var td2 = document.createElement('td');
        td2.appendChild(document.createTextNode(data[i]))
        tr.appendChild(td2)
        
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    ui_element.appendChild(tbl)
}

function readURL(input) {
    if (input.files && input.files[0]) {
        set_is_calculating(true); 
        var reader = new FileReader();

        reader.onload = function (e) {
            c.image_loader(e.target.result);
            setTimeout(() =>{
                set_is_calculating(false);
            }, 500);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function set_is_calculating(val){
    is_calculating = val;
    input_button.disabled = val; 
    rng_slider.disabled = val;
}


/*
test_stack_and_lsarray(5555);
test_heap(5555);
test_lsarray(5555);
*/