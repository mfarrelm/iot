const BROKER_ADDR = '192.168.1.100';
const BROKER_PORT = '3000';

var broker_url = 'ws://'+BROKER_ADDR+":"+BROKER_PORT;
var client = mqtt.connect(broker_url);

client.on('connect', async function() {
    console.log('MQTT client connected to '+broker_url);
    client.subscribe('TF-IIOT/NODE07/CT/071');

})
client.on('message', function(topic, message) {
  fields = topic.split("/");
  node = fields[1]
  if (fields[2] == 'CT' && node == 'NODE07'){
    value = parseInt(message.toString('utf-8'),10);
    document.getElementById('data_login').innerHTML = value;
  }

  if (fields[2] == 'DIR' && node == 'NODE07'){
    value = parseInt(message.toString('utf-8'),10);
    document.getElementById('data_login1').innerHTML = value;
  }
  if (fields[2] == 'DIB' && node == 'NODE07'){
    value = parseInt(message.toString('utf-8'),10);
    document.getElementById('data_login2').innerHTML = value;
  }
  if (fields[2] == 'DIG' && node == 'NODE07'){
    value = parseInt(message.toString('utf-8'),10);
    document.getElementById('data_login3').innerHTML = value;
  }

})
