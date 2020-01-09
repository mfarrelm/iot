const BROKER_ADDR = '192.168.43.62';
const BROKER_PORT = '3000';

const SYS_TOPIC = 'TF-IIOT/';
const TAG_TOPIC = 'CT';       // tag yang akan masuk chart

// nama eleman HTML
const E_NODES = 'e-nodes';
const E_TAGS = 'e-tags';
const E_CHART = 'e-chart';


// Nilai boolean
const OFF = 0;
const ON = 1;
const INVALID=2;

// warna LED untuk status
const led_colors = [
  "rgb(46, 204, 113)",   // 0: off
  "rgb(231, 76, 60)",    // 1: on
  "darkgrey"];           // invalid


// chart.js, multiline
var config = {
  type: 'line',
  data: {
    labels: [],  // akan diisi waktu
    datasets: [{
      label: 'CT',
      backgroundColor: window.chartColors.green,
      borderColor: window.chartColors.green,
      fill: false,
      data: [],   // sebaiknya diisi inisial
    }]
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: 'IOT NODE'
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Waktu'
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Brightness'
        }
      }]
    }
  }
};


// obyek-obyek yang sedang di supervisory
var nodes;
var active_node="";
var active_node_id=0;
var active_tag="";
var active_tag_id=0;

// pointer agar cepat akses data chart
var active_chart_title = config.data.datasets[0].title;
var active_chart_data = config.data.datasets[0].data;

// MQTT Setup
var broker_url = 'ws://'+BROKER_ADDR+":"+BROKER_PORT;
var client = mqtt.connect(broker_url);

var ledMode = 0; // 0 = manual, 1 = otomatis
var len_data = 10;

// Run when connected (continuous)
client.on('connect', function() {
    console.log('MQTT client connected to '+broker_url);
})

// Run when message received

client.on('message', function(topic, message) {
    // decode topic
    // SYS/NODE/TAG/NUM
    fields = topic.split("/");
    tag = fields[2] + fields[3];
    value = parseInt(message.toString('utf-8'),10);
    //console.log('Received %s = %d', tag, value);
    viewUpdateTag(tag, value);
    /*if (tag == active_tag) {
      viewUpdateChart(value);
    }*/
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

// Fungsi-fungsi REST
async function getTags(node_id) {
  url = '/api/tags/'+node_id;
  //console.log('Get :', url);
  response = await fetch(url);
  myJson = await response.json();
  // console.log(JSON.stringify(myJson));
  return myJson;
}

// mengisi data awal, memakai web Service
async function getData(tag_id, len_data) {
  url = '/api/data/'+tag_id+'/'+len_data.toString();
  console.log('Get :', url);
  response = await fetch(url);
  rjson = await response.json();
  console.log("FETCH ="+JSON.stringify(rjson));
  return rjson;
}

// ------------------------------------------------------------
// Fungsi-fungsi untuk update UI

// fungsi ganti active_node
// value berisi "node/node_id"
async function onChangeNode(value) {
  // berhenti subscribe node lama
  if (active_node != "") {
    client.unsubscribe(SYS_TOPIC+active_node+'/#');
  }

  // decode node baru
  fields = value.split('/');
  active_node = fields[0];
  active_node_id = parseInt(fields[1],10);

  // pisahkan nomor node
  node_num = active_node.substr(4);
  active_tag = TAG_TOPIC + node_num + '1';

  // tampilkan tags node baru
  await viewTags();

  // tampilkan char node baru
  await viewChart();

  // subscribe node baru
  client.subscribe(SYS_TOPIC+active_node+'/#');



}

async function viewNodes() {
  nodes = await getNodes();
  if (nodes) {
    // build menu sesuai hak
    shtml=`<select class="form-control" name="IOT-NODES" onchange="onChangeNode(this.value)">`;
    for (node of nodes) {
      shtml += `<option value="${node.NODE}/${node.ID}">${node.NODE}</option>`;
    }
    shtml+=`</select>`;
    onChangeNode(nodes[0].NODE+'/'+nodes[0].ID);
  }
  else {
    shtml="Cannot get the nodes";
  }
  //console.log(shtml);
  // ganti element
  document.getElementById(E_NODES).innerHTML = shtml;
}

async function viewTags() {
  tags = await getTags(active_node_id);
  console.log("TAG="+active_tag);
  if (tags) {
    // build table sesuai tags
    shtml=`<table class="table">`;
    for (tag of tags) {
      shtml += `<tr><td>${tag.TAG}</td><td id="${tag.TAG}">0</td></tr>`;
      // simpan tag_id agar nanti lebih cepat ambil data
      if (tag.TAG == active_tag) {
        active_tag_id = tag.ID;
        console.log("TAG_ID="+active_tag_id);
      }
    }
    shtml+=`</table>`;
  }
  else {
    shtml="Cannot fetch the node's tags";
  }
  //console.log(shtml);
  // ganti element
  document.getElementById(E_TAGS).innerHTML = shtml;
}

function viewUpdateTag(tag, value){
  e=document.getElementById(tag);
  if (e) {
    e.innerHTML = value;
    //console.log("Update "+tag+"="+value.toString());
  }
}

async function viewChart() {
  config.options.title.text = active_node;
  config.data.datasets[0].label = active_tag;
  config.data.datasets[0].data = [];
  config.data.labels = [];
  rdata = await getData(active_tag_id, len_data);
  console.log("DATA = "+JSON.stringify(rdata));
  if (rdata != null) {
    for (i=rdata.length-1; i>=0; i--) {
      console.log(JSON.stringify(rdata[i]));
      config.data.datasets[0].data.push(rdata[i].VALUE).toFixed(2);
      var date = rdata[i].DTIME.substring(11,19);
      date = (parseInt(date.substring(0,2)) + 7).toString() + date.substring(2,8);
      config.data.labels.push(date);
    }
    chart.update();
  }
}

function updateLEN_data(){
  len_data = document.getElementById("len_data").value;
  console.log(len_data);
  viewChart();
}

// Update chart
function viewUpdateChart(value) {
  if (config.data.datasets[0].data.length > 10) {
    config.data.datasets[0].data.shift();
  }
  config.data.datasets[0].data.push(value).toFixed(2);
  chart.update();
}

var ctx = document.getElementById(E_CHART).getContext('2d');
var chart = new Chart(ctx, config);
viewNodes();


function changeLEDMode(){

  ledMode = (ledMode + 1) % 2;
  //dipublish 3 kali agar pesan aman
  client.publish('TF-IIOT/' + active_node + '/YS/' + active_node.substring(4, 6) + '1',ledMode.toString(),{retain: true});
  client.publish('TF-IIOT/' + active_node + '/YS/' + active_node.substring(4, 6) + '1',ledMode.toString(),{retain: true});
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
  client.publish('TF-IIOT/' + active_node + '/DVR/' + active_node.substring(4, 6) + '1',this.value.toString(),{retain: true});
}
var sliderGreen = document.getElementById("slider_green");
sliderGreen.oninput = function() {
  client.publish('TF-IIOT/' + active_node + '/DVG/'  + active_node.substring(4, 6) + '1',this.value.toString(),{retain: true});
}
var sliderBlue = document.getElementById("slider_blue");
sliderBlue.oninput = function() {
  client.publish('TF-IIOT/' + active_node + '/DVB/' + active_node.substring(4, 6) + '1',this.value.toString(),{retain: true});
}

function updateBatas(){
  var CC = document.getElementById("CC").value;
  client.publish('TF-IIOT/' + active_node + '/CC/' + active_node.substring(4, 6) + '1', CC.toString(),{retain: true});
  client.publish('TF-IIOT/' + active_node + '/CC/' + active_node.substring(4, 6) + '1', CC.toString(),{retain: true});

}
