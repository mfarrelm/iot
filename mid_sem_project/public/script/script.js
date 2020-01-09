// SAlamat broker dan server
const brokerAddress = '192.168.43.62'
const serverAddress = '192.168.43.62'
const serverPort = 3000


var client = mqtt.connect('ws:192.168.43.62:3000');

// deklarasi variabel
var x1 = false;
var x2 = false;
var x3 = false;
var x4 = false;
var olddate1 = 0;
var olddate2 = 0;
var olddate3 = 0;
var rataTemp = 0;
var rataHum = 0;
var rataBright = 0;
var alfa = 0.005;
var ledMode = 0; // 0 = manual, 1 = otomatis
var batasHum = 0;
var batasTemp = 0;
var batasBright = 0;
var ledStatus = 0;

// fungsi ketika client berhasil connect
client.on('connect', function() {
    console.log('client connected at %s:%s',brokerAddress);
    client.subscribe('topic/humidity')
    client.subscribe('topic/temperature')
    client.subscribe('topic/brightness')
    client.subscribe('topic/ledmode')
    client.subscribe('topic/batashum')
    client.subscribe('topic/batastemp')
    client.subscribe('topic/batasbright')
    client.subscribe('topic/sliderred')
    client.subscribe('topic/slidergreen')
    client.subscribe('topic/sliderblue')
    client.subscribe('topic/ledstatus')
})

// penghitungan rata-rata dengan metode exponentially weighted moving average
function updateRata2Temp(data ){
  rataTemp = alfa * data + (1-alfa) * rataTemp
}
function updateRata2Hum(data){
  rataHum = alfa * data + (1-alfa) * rataHum
}
function updateRata2Bright(data){
  rataBright = alfa * data + (1-alfa) * rataBright
}


client.on('message', function(topic, message) {
    switch (topic) {
        case 'topic/humidity': changeValue(message,"humidity_value"); break;
        case 'topic/temperature': changeValue(message,"temperature_value"); break;
        case 'topic/brightness': changeValue(message,"brightness_value"); break;
    }

})

//fungsi untuk memasukkan data ke grafik
function changeValue(value,value_id) {
    d = new Date()
    switch (value_id) {
        case 'humidity_value':
            // data akan ditambahkan ke array dalam selang waktu 1 sekon
            if (d.getTime()- olddate1 >= 1000 ){
              olddate1 = d.getTime()
              config1.data.labels.push(d.getHours()+':'+d.getMinutes()+':'+d.getSeconds())
              config1.data.datasets[0].data.push(value).toFixed(2)
              //data akan dihapus jika total data sudah ada sebanyak 20 data
              if (config1.data.datasets[0].data.length > 20){
                config1.data.labels.shift();
                config1.data.datasets[0].data.shift();
              }
              mychart1.update(); // update chart
            }
            data_gauge1[0].value = parseFloat(value)
            Plotly.update(gauge1, data_gauge1, layout1,{responsive:true}) // update gauge
            updateRata2Hum(value); // update rata - rata
            document.getElementById("humidity_rata").innerHTML = rataHum.toFixed(2)
            data_gauge1[0].delta.reference = rataHum // update nilai referensi di gauge

            //untuk mode otomatis, yaitu penyalaan indikator sesuai nilai dan ambang batas
            if (ledMode == 1){
              if (parseFloat(value) >= batasHum){
                document.getElementById("alarm_hum").style.backgroundColor = "rgb(231, 76, 60)"
              }
              else{
                document.getElementById("alarm_hum").style.backgroundColor = "rgb(46, 204, 2)"
              }
            }


            break;
        case 'temperature_value':
            if(d.getTime() - olddate2 >= 1000){
              olddate2 = d.getTime()
              config2.data.labels.push(d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()) // Current time as chart label
              config2.data.datasets[0].data.push(value).toFixed(2)
              if (config2.data.datasets[0].data.length > 20){
                config2.data.labels.shift();
                config2.data.datasets[0].data.shift();
              }
              mychart2.update();
            }
            data_gauge2[0].value = parseFloat(value)
            Plotly.update(gauge2, data_gauge2, layout2,{responsive:true})
            updateRata2Temp(value)
            document.getElementById("temperature_rata").innerHTML = rataTemp.toFixed(2)
            data_gauge2[0].delta.reference = rataTemp
            if (ledMode == 1){
              if (parseFloat(value) >= batasTemp){
                document.getElementById("alarm_temp").style.backgroundColor = "rgb(231, 76, 60)"
              }
              else{
                document.getElementById("alarm_temp").style.backgroundColor = "rgb(46, 204, 2)"
              }
            }

            break;
        case 'brightness_value':
            if (d.getTime()-olddate3 >= 1000){
              olddate3 = d.getTime()
              config3.data.labels.push(d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()) // Current time as chart label
              config3.data.datasets[0].data.push(value).toFixed(2)
              if (config3.data.datasets[0].data.length > 20){
                config3.data.labels.shift();
                config3.data.datasets[0].data.shift();
              }
              mychart3.update();
            }
            data_gauge3[0].value = parseFloat(value)
            Plotly.update(gauge3, data_gauge3, layout3,{responsive:true})
            updateRata2Bright(value)
            document.getElementById("brightness_rata").innerHTML = rataBright.toFixed(2)
            data_gauge3[0].delta.reference = rataBright
            if (ledMode == 1){
              if (parseFloat(value)>= batasBright){
                document.getElementById("alarm_bright").style.backgroundColor = "rgb(231, 76, 60)"
              }
              else{
                document.getElementById("alarm_bright").style.backgroundColor = "rgb(46, 204, 2)"
              }
            }
            break;
    }
}

//fungsi untuk tombol pengubahan mode led
function changeLEDMode(){
  ledMode = (ledMode + 1) % 2;
  //dipublish 3 kali agar pesan aman
  client.publish('topic/ledmode',ledMode.toString(),{retain: true});
  client.publish('topic/ledmode',ledMode.toString(),{retain: true});
  client.publish('topic/ledmode',ledMode.toString(),{retain: true});
  if (ledMode == 1){
    document.getElementById("led_mode").innerHTML = "Otomatis"
  }
  //jika mode manual, ubah warna indikator menjadi hitam
  else{
    document.getElementById("led_mode").innerHTML = "Manual"
    document.getElementById("alarm_hum").style.backgroundColor = "rgb(0,0,0)"
    document.getElementById("alarm_temp").style.backgroundColor = "rgb(0,0,0)"
    document.getElementById("alarm_bright").style.backgroundColor = "rgb(0,0,0)"
  }
}

//fungsi untuk tombol menyalakan led
function turnLED(){
  //hanya berjalan jika mode manual
  if (ledMode == 0){
    ledStatus = (ledStatus + 1) % 2;
    client.publish('topic/ledstatus',ledStatus.toString(),{retain: true});
    client.publish('topic/ledstatus',ledStatus.toString(),{retain: true});
    client.publish('topic/ledstatus',ledStatus.toString(),{retain: true});
    if (ledStatus == 0){
      document.getElementById("led_id").innerHTML = "OFF"
    }

    else {
      document.getElementById("led_id").innerHTML = "ON"
    }
  }

}

//fungsi untuk mengganti ambang batas
function updateBatas(){
  batasHum = document.getElementById("batasHum").value;
  batasTemp = document.getElementById("batasTemp").value;
  batasBright = document.getElementById("batasBright").value;
  client.publish('topic/batashum',batasHum.toString(),{retain: true});
  client.publish('topic/batastemp',batasTemp.toString(),{retain: true});
  client.publish('topic/batasbright',batasBright.toString(),{retain: true});
}

//fungsi untuk mempublish nilai slider, yaitu untuk masukkan led rgb
var sliderRed = document.getElementById("slider_red");
sliderRed.oninput = function() {
  client.publish('topic/sliderred',this.value.toString(),{retain: true});
}
var sliderGreen = document.getElementById("slider_green");
sliderGreen.oninput = function() {
  client.publish('topic/slidergreen',this.value.toString(),{retain: true});
}
var sliderBlue = document.getElementById("slider_blue");
sliderBlue.oninput = function() {
  client.publish('topic/sliderblue',this.value.toString(),{retain: true});
}


//fungsi untuk tampilan collapsible
var coll = document.getElementsByClassName("collapsible");
var i;
for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}


// pembuatan layout dan data untuk chart.js
var ctx1 = document.getElementById('canvas1').getContext('2d');
var config1 = {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Humidity',
            backgroundColor: 'rgb(9,255,231)',
            borderColor: 'rgb(9,255,231)',
            data: [],
            fill: false,
        }]
    },
    options: {
      responsive : true,
      scales: {
        yAxes: [{
            ticks: {
                max: 100,
                min: 0,
                stepSize: 10
            }
        }]
      }
    }
};
var ctx2 = document.getElementById('canvas2').getContext('2d');
var config2 = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperature',
            backgroundColor: 'rgb(255, 0, 51)',
            borderColor: 'rgb(255, 0, 51)',
            data: [],
            fill: false,
        }]
    },
    options: {
      responsive : true,
      scales: {
        yAxes: [{
            ticks: {
                max: 50,
                min: 10,
                stepSize: 5
            }
        }]
      }
    }
};
var ctx3 = document.getElementById('canvas3').getContext('2d');
var config3 = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Brightness',
            backgroundColor: 'rgb(255, 255, 1)',
            borderColor: 'rgb(255, 255, 18)',
            data: [],
            fill: true,
        }]
    },

    options: {
      responsive : true,
      scales: {
        yAxes: [{
            ticks: {
                max: 10000,
                min: 0,
                stepSize: 1000
            }
        }]
      }
    }
};


//deklarasi variable untuk membuat chart
var mychart1 = new Chart(ctx1, config1);
var mychart2 = new Chart(ctx2, config2);
var mychart3 = new Chart(ctx3, config3);

//data dan layout untuk gauge
var data_gauge1 = [
  {
    type: "indicator",

    value: 100,
    delta: { reference: 27 },
    domain: { row: 0, column: 0 },
    gauge: {
     axis: { range: [null, 100] },
     steps: [
       { range: [0, 50], color: "lightgray" },
       { range: [50, 100], color: "gray" }
     ]}
  }]
var data_gauge2 = [
  {
    type: "indicator",
    value: 100,
    delta: { reference: 27 },
    domain: { row: 0, column: 0 },
    gauge: {
     axis: { range: [null, 40] },
     steps: [
       { range: [0, 20], color: "lightgray" },
       { range: [20, 40], color: "gray" }
     ]}
  }]
var data_gauge3 = [
  {
    type: "indicator",
    value: 100,
    delta: { reference: 27 },
    domain: { row: 0, column: 0 },
    gauge: {
     axis: { range: [null, 10000] },
     steps: [
       { range: [0, 5000], color: "lightgray" },
       { range: [5000, 10000], color: "gray" }
     ]}
  }]

var layout1 = {
  width: 320,
  height: 240,
  paper_bgcolor:'rgba(0,0,0,0)',
  plot_bgcolor:'rgba(0,0,0,0)',
  margin: { t: 40, b: 20, l: 40, r: 40 },
  grid: { rows: 0, columns: 0, pattern: "independent" },
  template: {
    data: {
      indicator: [
        {
          title: { text: "Humidity (%)" },
          mode: "number+delta+gauge",
          delta: { reference: 90 }
        }
      ]
    }
  }
};
var layout2 = {
  width: 320,
  height: 240,
  paper_bgcolor:'rgba(0,0,0,0)',
  plot_bgcolor:'rgba(0,0,0,0)',
  margin: { t: 40, b: 20, l: 40, r: 40 },
  grid: { rows: 0, columns: 0, pattern: "independent" },
  template: {
    data: {
      indicator: [
        {
          title: { text: "Temperature (°C)" },
          mode: "number+delta+gauge",
          delta: { reference: 90 }
        }
      ]
    }
  }
};
var layout3 = {
  width: 320,
  height: 240,
  paper_bgcolor:'rgba(0,0,0,0)',
  plot_bgcolor:'rgba(0,0,0,0)',
  margin: { t: 40, b: 20, l: 40, r: 40 },
  grid: { rows: 0, columns: 0, pattern: "independent" },
  template: {
    data: {
      indicator: [
        {
          title: { text: "Brightness (Lux)" },
          mode: "number+delta+gauge",
          delta: { reference: 90 }
        }
      ]
    }
  }
};

//deklarasi pembuatan gauge
Plotly.newPlot(gauge1, data_gauge1, layout1, {responsive:true});
Plotly.newPlot(gauge2, data_gauge2, layout2,{responsive:true});
Plotly.newPlot(gauge3, data_gauge3, layout3,{responsive:true});
