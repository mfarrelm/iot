// Server and broker address
//const brokerAddress = '192.168.100.7';
//const serverAddress = '192.168.100.7';

const serverAddress = '192.168.1.5';
const brokerAddress = serverAddress;
const serverPort = '3000';

const SYS = 'TF-IIOT/';
const WC_YT = SYS+'+/YT/#';
const WC_TT = SYS+'+/TT/#';

// Nilai boolean
const OFF = 0;
const ON = 1;
const INVALID=2;

// warna LED untuk status
const led_colors = [
  "rgb(46, 204, 113)",   // 0: off
  "rgb(231, 76, 60)",    // 1: on
  "darkgrey"];           // invalid

mapTT = new Map();
mapYT = new Map();
mapYY = new Map();

// Memakai Map untuk menyimpan value
mapTT.set(SYS+'NODE#99/TT/991',0);
mapTT.set(SYS+'NODE#98/TT/981',0);
mapTT.set(SYS+'NODE#97/TT/971',0);

mapYT.set(SYS+'NODE#99/YT/991',1);
mapYT.set(SYS+'NODE#98/YT/981',1);
mapYT.set(SYS+'NODE#97/YT/971',1);

mapYY.set(SYS+'NODE#99/YY/991',1);
mapYY.set(SYS+'NODE#98/YY/981',1);
mapYY.set(SYS+'NODE#97/YY/971',1);

// MQTT Setup
var client = mqtt.connect('ws:'+brokerAddress+':'+serverPort);

// Run when connected (continuous)
client.on('connect', function() {
    console.log('client connected at %s:%s',brokerAddress);

    // metode mendaftar satu persatu
    /*
    for (let tag of mapTT.keys()) {
      client.subscribe(tag);
      console.log('Subscribe: %s',tag);
    }
    */

    // metode mendaftar pakai wildcard
    client.subscribe(WC_TT);
    client.subscribe(WC_YT);
})

// Publish LED state when button pressed (toggle)
function onClickYY() {
  var topic = event.srcElement.id.toString('utf-8');
  console.log("Button clicked : %s", topic);

  // not kan value ybs.
  value = 1-mapYY.get(topic);
  console.log("Value %s : %d", topic, value);
  mapYY.set(topic,value);
  // publish
  client.publish(topic, value.toString(2));

  // sambil menunggu respond client, invalid-kan
  e=document.getElementById(topic);
  e.style.backgroundColor = led_colors[INVALID];
}

// Run when message received
client.on('message', function(topic, message) {
    console.log('received message on %s: %s', topic, message);
    str = topic.split("/");
    switch (str[2]) {
        case 'TT': changeTT(topic, message); break;
        case 'YT': changeYT(topic, message); break;
    }
})

// Update LED value with received state
function changeYT(topic, message){ // Change LED on message received
    str = message.toString('utf-8');
    console.log('Received %s : %s', topic, str);

    // ubah nilai pakai Map
    value = parseInt(str,2);
    mapYT.set(topic,value);

    // karena penampil YT dijadikan tombol (YY) maka ubah id
    str = topic.split("/");
    id = str[0]+'/'+str[1]+'/YY/'+str[3];

    e=document.getElementById(id);
    e.style.backgroundColor = led_colors[value];
}


// Update HTML when message received
function changeTT(topic, message) {
  str = message.toString('utf-8');
  console.log('Received %s : %s', topic, str);

  value = parseInt(str,10);

  // Update HTML content
  document.getElementById(topic).innerHTML = value;

  ds = mapTTData.get(topic);
  // Update chart
  if (ds.data.length > 10) {
      ds.data.shift();
  }
  ds.data.push(value).toFixed(2);
  chartTT.update();
}

// chart.js, multiline
var config = {
  type: 'line',
  data: {
    labels: [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0],  // akan diisi waktu
    datasets: [{
      label: 'TT991',
      backgroundColor: window.chartColors.red,
      borderColor: window.chartColors.red,
      fill: false,
      data: [],   // sebaiknya diisi inisial
    }, {
      label: 'TT981',
      backgroundColor: window.chartColors.green,
      borderColor: window.chartColors.green,
      fill: false,
      data: [],
    }, {
      label: 'TT971',
      backgroundColor: window.chartColors.blue,
      borderColor: window.chartColors.blue,
      fill: false,
      data: [],
    }]
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: 'Chart.js Line Chart'
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
          labelString: 'Sampling'
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Temperature'
        }
      }]
    }
  }
};

// untuk memudahkan ubah data, dibuat map
// Memakai Map untuk menyimpan value
mapTTData = new Map();
mapTTData.set(SYS+'NODE#99/TT/991',config.data.datasets[0]);
mapTTData.set(SYS+'NODE#98/TT/981',config.data.datasets[1]);
mapTTData.set(SYS+'NODE#97/TT/971',config.data.datasets[2]);

var ctx = document.getElementById('canvas').getContext('2d');
var chartTT = new Chart(ctx, config);
