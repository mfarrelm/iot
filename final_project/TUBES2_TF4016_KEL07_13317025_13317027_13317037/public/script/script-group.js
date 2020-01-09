l/*
Tampilan banyak none memakai heatmap
https://www.patrick-wied.at/static/heatmapjs/
*/

const BROKER_ADDR = '192.168.43.62';
const BROKER_PORT = '3000';

const SYS_TOPIC = 'TF-IIOT/';
const TAG_TOPIC = 'CT';       // tag yang akan masuk chart

// nama eleman HTML
const E_HEATMAP = 'e-heatmap';

// interval heatmap akan diupdate
const UPDATE_INTERVAL = 1000;
const CT_MAX = 5000;
const CT_MIN = 0;

const HEATMAP_SCALE = 400/5;

var ledMode = 0; // 0 = manual, 1 = otomatis

// hitung berapa data yang sudah diterima
var received_count=0;
var value_max=0;
var value_min=1000;


// heatmap
// create configuration object
var config = {
    container: document.getElementById(E_HEATMAP),
  };

// data-data heatmap
var heatmap = h337.create(config);
var heatmap_data = {
    max: CT_MAX,
    min: CT_MIN,
    data: []
}

// KALAU DI SET DI SINI, KELUAR
// KALAU DARI viewHeatmap(), tak mau
//heatmap.setData(heatmap_data);

// map untuk mempercepat akses ke heatmap_data
var mapCT = new Map();

// MQTT Setup
var broker_url = 'ws://'+BROKER_ADDR+":"+BROKER_PORT;
var client = mqtt.connect(broker_url);



// Run when connected (continuous)
client.on('connect', async function() {
    console.log('MQTT client connected to '+broker_url);

        // siap terima semua data CT
    topic = SYS_TOPIC+'+/'+TAG_TOPIC+'/#';
    client.subscribe(topic);
    client.subscribe(SYS_TOPIC + '+/' + 'DIR' + '/#');
    client.subscribe(SYS_TOPIC + '+/' + 'DIG' + '/#');
    client.subscribe(SYS_TOPIC + '+/' + 'DIB' + '/#');
    console.log("Subscribe for "+topic);
    timer = setInterval(viewUpdateHeatmap, UPDATE_INTERVAL);

})

var arrayLEDNODE = {};
for(i = 0; i <= 16; i++){
  if(i < 10){
    var key_r = 'NODE0' + i + 'R';
    var key_g = 'NODE0' + i + 'G';
    var key_b = 'NODE0' + i + 'B';
  }
  else{
    var key_r = 'NODE' + i + 'R';
    var key_g = 'NODE' + i + 'G';
    var key_b = 'NODE' + i + 'B';
  }

  arrayLEDNODE[key_r] = 128;
  arrayLEDNODE[key_g] = 128;
  arrayLEDNODE[key_b] = 128;
}

console.log(arrayLEDNODE);
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// Run when message received
client.on('message', function(topic, message) {
    // decode topic
    // SYS/NODE/TAG/NUM

    fields = topic.split("/");
    console.log(fields[2])
    if (fields[2] == 'CT'){
      node = fields[1];
      value = parseInt(message.toString('utf-8'),10);
      //console.log('Received %s = %d', node, value);
      onReceiveCT(node, value);
    }

    else if (fields[2] == 'DIR'){
      node = fields[1];
      value = parseInt(message.toString('utf-8'),10);
      console.log('1');
      arrayLEDNODE[node + 'R'] = value;
    }

    else if (fields[2] == 'DIG'){
      node = fields[1];
      value = parseInt(message.toString('utf-8'),10);
      arrayLEDNODE[node + 'G'] = value;
      console.log(value);
    }

    else if (fields[2] == 'DIB'){
      node = fields[1];
      value = parseInt(message.toString('utf-8'),10);
      arrayLEDNODE[node + 'B'] = value;
    }
    var r = arrayLEDNODE[node + 'R'];
    var g = arrayLEDNODE[node + 'G'];
    var b = arrayLEDNODE[node + 'B'];
    document.getElementById(node + 'V').style.backgroundColor = rgbToHex(r,g,b);
    //console.log(rgbToHex(r,g,b))

})

//----------------------------------------------------
// Fungsi-fungsi REST
async function getNodes() {
  url = '/api/nodes';
  //console.log('Get :', url);
  response = await fetch(url);
  rjson = await response.json();
  //console.log(JSON.stringify(rjson));
  return rjson;
}

// ------------------------------------------------------------
// Fungsi-fungsi untuk update UI

// memasukkan data CT ke heatmap
async function onReceiveCT(node, value) {
    point = mapCT.get(node);
    if (point != null) {
        point.value = value;
        received_count +=1;
        //console.log("Update "+node+"="+JSON.stringify(point));
    }
}

// mengambil data posisi (X,Y) semua node
// lalu menginisiasi tampilan heat map
async function viewHeatmap() {
  nodes = await getNodes();
  if (nodes) {
    // build heat map
    heatmap_data.data = []; /// kosongkan dulu
    for (node of nodes) {
        var point = new Object();
        point.x = node.PX * HEATMAP_SCALE;
        point.y = node.PY * HEATMAP_SCALE;
        point.value = node.PX*node.PY*300;
        heatmap_data.data.push(point);
        mapCT.set(node.NODE,point);
    }
    heatmap.setData(heatmap_data);
    console.log('heatmap_data = '+JSON.stringify(heatmap_data));
    return true;
  }
  else {
    shtml="Cannot get the nodes";
    document.getElementById(E_HEATMAP).innerHTML = shtml;
    return false;
  }
}

// menampilkan heatmap kalau ada data yang sudah berubah
function viewUpdateHeatmap() {
    if (received_count > 0) {
        heatmap.setData(heatmap_data);
        received_count=0;
        console.log('Heatmap repainted');
    }
}

viewHeatmap();

function changeLEDMode(){
  ledMode = (ledMode + 1)%2;

  //dipublish 3 kali agar pesan aman
  publishAll('YS', ledMode);

  if (ledMode == 1){
    document.getElementById("led_mode").innerHTML = "Otomatis"
  }
  //jika mode manual, ubah warna indikator menjadi hitam
  else{
    document.getElementById("led_mode").innerHTML = "Manual"
  }
}

var sliderRed = document.getElementById("slider_red");
sliderRed.oninput = function() {
  publishAll('DVR', this.value);
}
var sliderGreen = document.getElementById("slider_green");
sliderGreen.oninput = function() {
  publishAll('DVG', this.value);
}
var sliderBlue = document.getElementById("slider_blue");
sliderBlue.oninput = function() {
  publishAll('DVB', this.value);
}

function updateBatas(){
  var CC = document.getElementById("CC").value;
  publishAll('CC', CC);

}

function publishAll(topic, value){
  for (i = 1; i <= 9; i++){
    if(checkDict[i]){
      client.publish('TF-IIOT/NODE0' + i.toString() + '/' + topic + '/0' + i.toString() + '1' ,value.toString(),{retain: true});
    }
  }

  for (i = 10; i <= 16; i++){
   if(checkDict[i]){
     client.publish('TF-IIOT/NODE' + i.toString() + '/' + topic + '/' + i.toString() + '1' ,value.toString(),{retain: true});
   }
  }
}
var checkDict = {1 : false, 2 : false, 3 : false, 4 : false, 5 : false, 6 : false, 7 : false, 8 : false, 9 : false,
  10 : false, 11 : false, 12 : false,
13 : false,14 : false, 15 : false, 16 : false,};

function checkNODE(id){
  num_id = parseInt(id.substring(4,6));
  checkDict[num_id] = document.getElementById(id).checked;
  console.log(checkDict);
}

function ubahDinamik(){
  for (i = 1; i <= 255; i++){
    setTimeout(function(){
      publishAll('DVR', i);

    }, 20);
  }
  publishAll('DVR', 0);
  for (i = 1; i <= 255; i++){
    setTimeout(function(){
      publishAll('DVG', i);

    }, 20);
  }
  publishAll('DVG', 0);
  for (i = 1; i <= 255; i++){
    setTimeout(function(){
      publishAll('DVB', i);

    }, 20);
  }
  publishAll('DVB', 0);
}
