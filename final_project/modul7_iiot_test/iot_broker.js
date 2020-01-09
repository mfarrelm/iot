// MQTT Broker

const MQTT_CONFIG = {
  http: { // Using HTTP protocol
    port: 3000,
    host: '192.168.100.73',
    bundle: true,
    static: './public/' // Serving public folder
  }
}

// Embedded Mosca initialization
var mosca = require("mosca");
var server = new mosca.Server(MQTT_CONFIG);

// Triggered when server status is ready
server.on('ready', function(){
  var address, ifaces = require('os').networkInterfaces();
  for (var dev in ifaces) {
    ifaces[dev].filter((details) => details.family === 'IPv4' && details.internal === false ? address = details.address: undefined);
  }
  console.log('MQTT Broker is up and running');
  console.log('Host IP Address = '+address);
  console.log('MQTT server port = 1883');
  console.log('MQTT over Web-Sockets port = '+MQTT_CONFIG.http.port);
})

// Triggered when a client is connected
server.on('clientConnected', function(client) {
    console.log('client connected', client.id)
})

// Triggered when a message is received
server.on('published', function(packet, client) {
    console.log(packet.topic,'=', packet.payload.toString('utf-8'))
})
