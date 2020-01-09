/* SIMULATOR 16 NODES
*/

//---- Configuratior
const BROKER_ADDR = '127.0.0.1'
const SYS_TOPIC = 'TF-IIOT/'
const NODE_NAME = 'NODE';
const NODE_NUMS = [
  '01', '02', '03', '04', '05', '06', '07', '08',
  '09', '10', '11', '12', '13', '14', '15', '16'
];

var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://'+BROKER_ADDR)

client.on('connect', function () {
    client.subscribe(SYS_TOPIC+'/DVR/#');
    client.subscribe(SYS_TOPIC+'/DVB/#');
    client.subscribe(SYS_TOPIC+'/DVG/#');
    client.subscribe(SYS_TOPIC+'/YS/#');

    createNodes();
    console.log(nodes);
    setInterval(simulateNodes, 1000);
    setInterval(simulateClient, 10000);
})

client.on('message', function (topic, message) {
  // decode the topic
  fields = topic.split('/');
  sNode = fields[1];
  sNodeNum = sNode.split('NODE');
  sTag = fields[2];
  sTagNum = fields[3];
  value = parseInt(message, 10);

  console.log("Received NODE"+sNodeNum+"/"+sTag+sTagNum+"="+value.toString());

  updateNode(sNodeNum, sTag, sTagNum, value);
})


// NODES simulation
// Struktur data menyimpan 16 nodes
var nodes = new Array();

// membuat nodes
function createNodes() {
  for (const num of NODE_NUMS) {
    nodes[num] = {
      'CT' : 3000,
      'CC' : 3000,
      'DIR' : 128,
      'DIG' : 128,
      'DIB' : 128,
      'DVR' : 128,
      'DVG' : 128,
      'DVB' : 128,
      'YI' : 0,
      'YS' : 0
    }
  }
}

// mengubah nilai tags suatu node
function updateNode(sNodeNum, sTag, sTagNum, value) {
  nodes[sNodeNum][sTag] = value;
  console.log('Update: NODE'+sNodeNum+'/'+sTag+sTagNum+'='+value.toString());
}

var t=0;
const periode = 40;

function simulateNodes() {
    t = (t + 1) % periode;
    v = 3000+Math.sin(Math.PI * 2 * t / periode) * 2000;
    for (num of NODE_NUMS) {
      tag = nodes[num];
      value = v + Math.floor(Math.random() * 200) - 100;
      // batasi harga
      if (value < 0) {
        value = 0;
      }
      else if (value > 10000) {
        value = 10000;
      }
      tag['CT'] = value;
      client.publish(SYS_TOPIC + 'NODE' + num + '/CT/' + num +'1',value.toString(),{retain: true});

      if (tag['YS'] = 0) {
        tag['DIR'] = tag['DVR'];
        tag['DIG'] = tag['DVG'];
        tag['DIB'] = tag['DVB'];
      }
      else {
        // seharusnya ada kontrol ON-OFF di sini
        tag['DIR'] = 0;
        tag['DIG'] = 0;
        tag['DIB'] = 0;
      }
      client.publish(SYS_TOPIC + 'NODE' + num + '/DIR/' + num +'1',tag['DIR'].toString(),{retain: true});
      client.publish(SYS_TOPIC + 'NODE' + num + '/DIG/' + num +'1',tag['DIG'].toString(),{retain: true});
      client.publish(SYS_TOPIC + 'NODE' + num + '/DIB/' + num +'1',tag['DIB'].toString(),{retain: true});

      if (tag['YS'] != tag['YI']) {
        tag['YI'] = tag['YS'];
        client.publish(SYS_TOPIC + 'NODE' + num + '/YI/' + num +'1',tag['YI'].toString(),{retain: true});
      }
    }
    console.log('Simulate Nodes');
}

var toggle = 0;
function simulateClient() {
  toggle = 1-toggle;
  for (num of NODE_NUMS) {
    client.publish(SYS_TOPIC + 'NODE' + num + '/YS/' + num +'1',toggle.toString(),{retain: true});
  }
  console.log('Simulate Client');
}
